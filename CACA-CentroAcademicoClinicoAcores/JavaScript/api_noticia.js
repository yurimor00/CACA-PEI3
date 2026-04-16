async function carregarNoticiasAPI() {
    const container = document.getElementById('api-noticias');
    const url = `https://newsapi.org/v2/everything?q=saúde%20portugal&language=pt&sortBy=publishedAt&pageSize=6&apiKey=${API.NEWS_API_KEY}`;

    try {
        const resposta = await fetch(url);
        const dados = await resposta.json();

        if (dados.articles) {
            container.innerHTML = ""; // Limpa as notícias estáticas
            dados.articles.forEach(artigo => {
                const imagemBot = artigo.urlToImage ? artigo.urlToImage : './media/noticia-default.jpg';
                const article = `                    
                        <article class="news-card">
                            <img src="${imagemBot}" alt="${artigo.title}">
                            <h4>${artigo.title}</h4>
                            <a href="${artigo.url}" class="link-blue" target="_blank">Saiba mais</a>
                        </article>`
                
                container.innerHTML += article;
            });
        }
    } catch (error) {
        console.error("Erro ao carregar notícias:", error);
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', carregarNoticiasAPI);