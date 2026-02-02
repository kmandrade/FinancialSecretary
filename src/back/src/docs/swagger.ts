export function swaggerHtml(openApiUrl: string) {
  const url = openApiUrl.replace(/"/g, '&quot;');
  return `<!doctype html>
<html lang="pt-br">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>FinancialSecretary API Docs</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  <style>
    body { margin: 0; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        url: "${url}",
        dom_id: '#swagger-ui',
        deepLinking: true,
        persistAuthorization: true,
      });
    };
  </script>
</body>
</html>`;
}
