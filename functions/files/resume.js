export async function onRequest({ request, env }) {
    try {
        const object = await env.WEBSITE_FILES.get("JobChumoResume.pdf");

        if (object === null) {
            return new Response("Resume not found", { status: 404 });
        }

        const headers = new Headers();
        headers.set("Content-Type", "application/pdf");
        headers.set("Content-Disposition", "attachment; filename=JobChumoResume.pdf");

        return new Response(object.body, { headers });
    } catch (error) {
        return new Response("Error fetching resume: " + error.message, { status: 500 });
    }
}