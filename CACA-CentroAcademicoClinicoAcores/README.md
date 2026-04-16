PEI 1
 João Bento 2023110753
 Manuel Santos 2023110848
 Yuri Moreira 2023118908


Cores:

Azul marinho #0B2545, utilizado como cor principal. Transmite seriedade, cria um bom contraste com o restante das cores escolhidas e enquadra-se no tema de saúde do site

Verde água #29B89E, utilizado nos títulos de cada secção apenas pelo seu contraste e para evitar um site monocromático em todos os detalhes, é também uma cor recorrente no ambiente clínico.

Azul claro #3371F2, utilizado para alguns botões interativos por ser uma cor que contrasta bem com o azul marinho, evitando que a cor principal se torne repetitiva
 ou imperceptível em algumas zonas do site

Azul gelo #EEF4ED, utilizado para background dos cards para ter um efeito mais discreto, manter os contrastes em diferentes tons de azul e evitar o branco sobre branco  

Branco #ffffff, utlizado como background de todo o site, semelhante a um ambiente clínico/hospitalar destaca-se pela sua sobriedade e dá espaço para qualquer cor se destacar.
O contraste com as cores escolhidas deixa o site facilmente legível e com um aspeto organizado.

Fonte: Montserrat
Esta fonte foi escolhida pela sua boa legibilidade e minimalismo, juntamente com a escollha de cores é uma combinação que atende a grande parte do público, pois o azul é dificilmente alterado
na maioria dos tipos de daltonismo e a simplicidade e geometria da fonte facilita a leitura para pessoa com deficiências visuais.

Benchmarking:

CCAL (Centro clínico académico de Lisboa) - secção hero, secção notícias e eventos (utilização dos cards em linhas de 3) e organização da informação.

Este site contribuiu para o nosso trabalho principalmente pela utilização dos cards em linha para apresentar a informação, é um visual limpo e organizado por isso decidimos adotá-lo.
No entanto, para manter a simplicidade, ao contrário do CCAL decidimos apenas deixar visível o título de cada notícia com a opção de um botão "saber mais" para quem busca mais informação,
contudo, por mais que seja uma boa estratégia para reduzir o texto na página inicial limita também os detalhes dados porque nesta fase do trabalho trabalhamos só com a landing page.

CCAB (Centro clínico académico das beiras) - baseamo-nos apenas na estrutura da barra de navegação do site.

CAC-CL (Centro clínico académico católica luz) - baseamo-nos principalmente na secção de eventos pela sua criatividade e no footer com a adição de uma newsletter, a forma como a informação foi distribuída
ao longo de todo o site também foi utilizada por nós, pois transmite a informação de uma forma clara e objetiva e de modo a chamar a atenção do utilizador.

#----------------------------------------------------------------------------------------------------------------------------------------#

PEI 2
João Bento 2023110753
Rafael Medeiros 2024109280
Yuri Moreira 2023118908

Acessibilidade Visual:
    Cores:
        Background: 
            --white #ffffff
                Cor utilizada para o background da página, promove um excelente contraste, passando em todos os testes WCAG AAA com práticamente todas as outras cores utilizadas.
            
            --bg-light: #EEF4ED
                Esta cor é utilizada para backgrounds de cards e outras situações similares, sendo emparelhada com preto #000000 ou a cor primária #0B2545. Passa em todos os testes WCAG AAA.

        Comparações:
            --primary color: #0B2545
                Apresenta um contraste de 15.38:1, passando os testes WCAG AAA para texto normal, trexto grande e elementos gráficos.

            --accent-color: #29B89E
                Apresenta um contraste de 2.48:1, não passando os testes. Esta cor será alterada para #1B8572. 
            Nova --accent-color: #1B8572
                Apresenta um contraste de 4.52:1, falhando apenas o teste WCAG AAA para texto normal, como é utilizado apenas em textos maiores isto não terá muito impacto.

            --accent-color1: #3371F2
                Apresenta um contraste de 4.38:1, não passando os testes WCAG AAA necessários à sua utilidade. Esta cor será alterada para #2C6BF2.
            Nova --accent-color1: #2C6BF2
                Apresenta um contraste de 4.67:1, falhando apenas o teste WCAG AAA para texto normal, passando nos restantes necesseários à sua utilidade.

            --text-color: #000000
                Cor utilizada para texto, cumpre com todos os testes WCAG AAA com os backgrounds utilizados.

        A utilização destas cores permitem acessibilidade a pessoas com deficiências visuais, como por exemplo, Visão Desfocada, Contraste Reduzido e Daltonismo.

    Fonte:
        Montserrat
            Esta fonte foi escolhida pela sua boa legibilidade e minimalismo, possui um espaçamento uniforme entre cada letra e foi criada utilizando formas geométricas perfeitas, isto promove acessibilidade para pessoas com deficiências visuais, por exemplo, Dislexia.
    

    Dark Mode
        Utilizado um background escuro com letras claras para melhor acessibilidade (contraste) e/ou preferência do usuário. 
            
Acessibilidade Motora:
    Espaço entre clicáveis para utilizadores com dificuldades motoras
    Resizing correto para os diferentes dispositivos.

Outras Acessibilidades (Preferencias):
    media queries (reduced motion)
        Verifica se o utilizador tem reduced motion ativado e "desativa" as transições

#-----------------------------------------------------------------------------------------------------------------------------------------
Miguel Matos - 2024111725
Yuri Moreira - 
Alexandre Pereira -

Miguel Matos - Adicionou uma nova secçao denominada localização no HTML e usou a API do google maps para mostrar a  localização 
da universidade dos açores. Quando utilizar no site é necessario colocar as suas api pois por motivos de segurança foi necessario criar um ficheiro onde fica escondido as api usando o .gitignore . Para colocar as api basta criar um ficheiro com o nome "API.js" e colocar as api`s como mostra o ficheiro "API.example.js". Assim fica funcional a zona de loalização e de noticias funcionando com APIs.Foi feita tambem parte da organização dos ficheiros e por fiz a criação da função carregarnoticias .

Yuri Moreira - O painel de gestão foi desenhado como uma Janela Flutuante (Modal) escondida. O acesso é feito através de um link no rodapé.

A comunicação com a base de dados (cacaDB) é feita de forma assíncrona, garantindo que a interface do site nunca bloqueia ou fica lenta enquanto os dados são processados.
A função principal acede à base de dados em modo de leitura e extrai todos os registos guardados. A interface atualiza-se dinamicamente, limpando a lista atual e injetando os novos elementos no painel, mostrando o título, a data, o local e cria os respetivos botões de edição e remoção para cada evento.

Ao clicar em "Editar" num evento, o sistema procura esse registo específico na base de dados e preenche automaticamente todos os campos do formulário com os dados atuais.
Ao submeter o formulário, o código substitui o registo antigo pelo novo e repõe o painel para o modo normal de adicionar evento.

Imediatamente após qualquer adição, edição ou remoção, o sistema força a atualização automática das interfaces. Isto assegura que a alteração se reflete instantaneamente tanto no carrossel público do site como na lista do painel de administração, sem que o utilizador precise de recarregar a página manualmente.
