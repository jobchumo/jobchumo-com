export default {
    async fetch(request, env) {
        // Get the URL and parse it
        const url = new URL(request.url);

        // Check if the request is for the resume
        if (url.pathname === "/files/resume") {
            try {
                // Fetch the resume from R2
                const object = await env.WEBSITE_FILES.get("JobChumoResume.pdf");

                // If object doesn't exist, return 404
                if (object === null) {
                    return new Response("Resume not found", { status: 404 });
                }

                // Set up headers for file download
                const headers = new Headers();
                headers.set("Content-Type", "application/pdf");
                headers.set("Content-Disposition", "attachment; filename=JobChumoResume.pdf");

                // Return the PDF file
                return new Response(object.body, { headers });
            } catch (error) {
                return new Response("Error fetching resume: " + error.message, { status: 500 });
            }
        }

        // Return 404 for any other paths
        return new Response("Not found", { status: 404 });
    }
};