export default {
  async fetch(request: Request, env: any) {
    // Add CORS headers helper function
    const corsHeaders = {
      'Access-Control-Allow-Origin': 'https://eggy-car.site',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Origin, Accept',
      'Access-Control-Allow-Credentials': 'true',
    };

    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders,
      });
    }

    const url = new URL(request.url);

    if (request.method === "GET") {
      // 获取评论
      const contentId = url.searchParams.get("content_id");
      if (!contentId) return new Response("缺少 content_id", { status: 400 });

      const { results } = await env.DB
        .prepare("SELECT id, parent_id, name, content, created_at, likes FROM comments WHERE content_id = ? ORDER BY created_at ASC")
        .bind(contentId)
        .all();

      // 组装层级结构
      const commentsMap = new Map<number, any>();
      const rootComments: any[] = [];

      results.forEach(comment => {
        comment.replies = [];
        commentsMap.set(comment.id, comment);

        if (comment.parent_id) {
          const parent = commentsMap.get(comment.parent_id);
          if (parent) parent.replies.push(comment);
        } else {
          rootComments.push(comment);
        }
      });

      return new Response(JSON.stringify(rootComments), {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }

    if (request.method === "POST") {
      // 发表评论或回复
      const { content_id, name, email, content, parent_id } = await request.json();
      if (!content_id || !name || !email || !content) return new Response("缺少字段", { status: 400 });
			console.log("content_id",content_id,name,email,content,parent_id);
      await env.DB
        .prepare("INSERT INTO comments (content_id, name, email, content, parent_id, likes) VALUES (?, ?, ?, ?, ?, 0)")
        .bind(content_id, name, email, content, parent_id || null)
        .run();

      return new Response("评论成功", {
        status: 201,
        headers: corsHeaders
      });
    }

    if (request.method === "PATCH") {
      // 点赞
      const { comment_id } = await request.json();
      if (!comment_id) return new Response("缺少 comment_id", { status: 400 });

      await env.DB
        .prepare("UPDATE comments SET likes = likes + 1 WHERE id = ?")
        .bind(comment_id)
        .run();

      return new Response("点赞成功", {
        status: 200,
        headers: corsHeaders
      });
    }

    return new Response("Method Not Allowed", {
      status: 405,
      headers: corsHeaders
    });
  },
};
