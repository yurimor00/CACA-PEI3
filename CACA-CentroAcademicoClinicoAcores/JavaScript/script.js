import { Evento } from "./evento.js"
import { startDB, addEventDB, addSubscritorDB,getEventosDB, updateEventDB, deleteEventDB } from "./database.js"
import { obterPrevisaoEvento } from "./meteorologia.js"
let db
let eventoEmEdicao = null


document.addEventListener('DOMContentLoaded', () => {
    /*
    DOM ELEMENTS & CONSTANTS
    */

    //Newsletter Constants
    const form = document.getElementById("form-newsletter")
    const nomeF = document.getElementById("nome")
    const telemovelF = document.getElementById("telemovel")
    const emailF = document.getElementById("email")
    const mensagemFeedback = document.getElementById("mensagem-feedback")

    //Dropdown Indicativo
    const dropdownContainerIndicativo = document.getElementById('dropdown-indicativo')
    const dropdownSelectedIndicativo = dropdownContainerIndicativo.querySelector('.dropdown-selected')
    const dropdownOptionsIndicativo = dropdownContainerIndicativo.querySelector('.dropdown-options')
    const inputIndicativoHidden = document.getElementById('indicativo')

    //Dropdown Mensagem
    const mensagemEscrita = document.getElementById("mensagem")
    const dropdownAssuntoContainer = document.getElementById('dropdown-assunto')
    const dropdownAssuntoSelected = document.getElementById('assunto-selected')
    const dropdownAssuntoOptions = document.getElementById('assunto-options')
    const inputAssuntoHidden = document.getElementById('assunto')
    const mensagemPreDefinida = {
        ajuda: 'Boa tarde, gostava de pedir ajuda com...',
        evento: 'Boas, tenho interesse em saber mais informações sobre o evento...',
        marcacao: 'Olá, quero marcar uma consulta no dia...',
        ensino: 'Olá, gostaria de saber mais sobre o vosso programa de ensino'
    }

    //Back to Top Button
    const toTopbtn = document.getElementById("to-top")

    // Gestão de Eventos (Formulário Admin) Constants
    const formGestaoEvento = document.getElementById("form-gestao-evento")
    const inputGestaoTitulo = document.getElementById("evento-titulo")
    const inputGestaoDescricao = document.getElementById("evento-descricao")
    const inputGestaoData = document.getElementById("evento-data")
    const inputGestaoHora = document.getElementById("evento-hora")
    const inputGestaoLocal = document.getElementById("evento-local")
    const inputGestaoImagem = document.getElementById("evento-imagem")
    const feedbackGestao = document.getElementById("gestao-feedback")
    
    //Carousel Constants
    const track = document.getElementById("carousel-track")
    const btnNext = document.getElementById("forward")
    const btnPrev = document.getElementById("prev")
    const imagens = ["media/hero.png", "media/evento1.png", "media/sobre_nos.png"]

    //Hamburger Menu Constants
    const headerBtn = document.getElementById('header-menu')
    const menuLinks = document.getElementById('nav-links')
    const navItems = document.querySelectorAll('#nav-links a')

    //Logo Constants
    const textElement = document.querySelector('.text p')
    const textContent = textElement.innerText
    const angle = 360 / textContent.length

    textElement.innerHTML = textContent.split("").map(
        (char, i) => {
            return `<span style="transform: translate(-50%, -50%) rotate(${i * angle}deg) translateY(-52px)">${char}</span>`
        }
    ).join("")

    //Dark Mode Constants
    const themeToggleBtn = document.getElementById('theme-toggle')
    const htmlEl = document.documentElement
    const sunIcon = themeToggleBtn.getAttribute('icon-sun')
    const moonIcon = themeToggleBtn.getAttribute('icon-moon')

    //Events Carousel Constants
    const eventTrack = document.querySelector('.events-track')
    const eventCards = document.querySelectorAll('.event-card')
    const eventPrevBtn = document.getElementById('event-prev')
    const eventNextBtn = document.getElementById('event-next')

    // ADMIN TOGGLE
    const modalAdmin = document.getElementById("modal-admin")
    const btnAbrirAdmin = document.getElementById("btn-abrir-admin")
    const fecharAdmin = document.getElementById("fechar-admin")
    const btnCancelar = document.getElementById("btn-cancelar-edicao")
    
    if (btnAbrirAdmin) {
        btnAbrirAdmin.addEventListener("click", (e) => {
            e.preventDefault()
            modalAdmin.style.display = "flex"
            renderListaAdmin()
        })
    }
    const fecharPainel = () => {
        modalAdmin.style.display = "none";
        eventoEmEdicao = null;
        formGestaoEvento.reset();
        document.getElementById("admin-titulo").textContent = "Painel de Gestão"
        document.getElementById("btn-submit-admin").textContent = "Guardar Evento"
        btnCancelar.style.display = "none"
    }
    fecharAdmin?.addEventListener("click", fecharPainel)
    btnCancelar?.addEventListener("click", fecharPainel)
    window.addEventListener("click", (e) => { if (e.target === modalAdmin) fecharPainel() })
    /*
    STATE VARIABLES
    */
    let indiceAtual = 1
    let isTransitioning = false
    /* 
      FUNCTIONS
     */

    //Função switch do menu para telemovel
    function toggleMenu() {
    menuLinks.classList.toggle('active')
}


    //Checks if each user input is correct, if not correct, makes the border of the incorrect input red
    async function validadeForm(event) {
        event.preventDefault()
    //Here all border colors and the feedback messages are resetted 
        nomeF.style.border = ''
        telemovelF.style.border = ''
        emailF.style.border = ''
        mensagemEscrita.style.border= ''
        mensagemFeedback.textContent = ''

        let error = false //Created an boolean to check if any error is detected

        const regexpNome = /^[a-zA-ZÀ-ÿ\s]{2,}$/       
        const regexpEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        const indicativo = document.getElementById("indicativo").value
        const numeroInserido = telemovelF.value.trim().replace(/\s/g, '')
        const país = {
            "+351": /^9[1236]\d{7}$/, // Portugal
            "+49": /^1[5-7]\d{8,9}$/, // Alemanha
            "+61": /^4\d{8}$/, // Austrália
            "+55": /^[1-9]{2}9\d{8}$/, // Brasil
            "+1": /^[2-9]\d{9}$/, // EUA 
            "+33": /^[67]\d{8}$/, // França
            "+39": /^3\d{8,9}$/, // Itália
            "+81": /^[789]0\d{8}$/, // Japão
            "+44": /^7\d{9}$/, // Reino Unido
            "+41": /^7[5-9]\d{7}$/ // Suíça  
        }
        const regexpTelemovel = país[indicativo] 
        if (mensagemEscrita.value ===""){
            error = true
            mensagemEscrita.style.border = "2px solid red"
        }
        //If value inserted by user is blank, changes border to red and makes error var true
        if (!regexpNome.test(nomeF.value.trim())) {
            error = true
            nomeF.style.border = "2px solid red"
        }
        //If value inserted by user is not 9 in lenght, makes border red and error set to true
        if (regexpTelemovel.test(numeroInserido) === false) {
            error = true
            telemovelF.style.border = "2px solid red"
        }
        //If value inserted by user doesnt contain an @ makes border red and sets error to true
        if (!regexpEmail.test(emailF.value.trim())) {
            error = true
            emailF.style.border = "2px solid red"
        }
        //If error is true, changes the feedback message that was blankk, and makes the color red to emphasize user error
        if (error === true) {
            mensagemFeedback.textContent = "Por favor, corrija os campos a vermelho."
            mensagemFeedback.style.color = "red"
        } else {
            try {
                const novoSubscritor = {
                    nome: nomeF.value.trim(),
                    telemovel: numeroInserido,
                    email: emailF.value.trim()
                }
                // Gravar na IndexedDB
                const msgBaseDados = await addSubscritorDB(db, novoSubscritor);

                // Feedback visual de sucesso
                mensagemFeedback.textContent = "Sucesso! A sua inscrição foi enviada e guardada.";
                mensagemFeedback.style.color = "#29B89E";
                
                form.reset()
                dropdownAssuntoSelected.textContent = "Assunto"
            } catch (erro) {
                console.error(erro)
                mensagemFeedback.textContent = erro.message || erro
                mensagemFeedback.style.color = "orange"
            }
        }

    }
    //--- Dropdown do indicativo ---
    dropdownSelectedIndicativo.addEventListener('click', function(event) {
    dropdownOptionsIndicativo.classList.toggle('open')
    event.stopPropagation() 
    })
    const todasOpcoes = dropdownOptionsIndicativo.querySelectorAll('li')
    todasOpcoes.forEach(function(opcao) {
        opcao.addEventListener('click', function() {
            dropdownSelectedIndicativo.textContent = this.getAttribute('short-data')
            inputIndicativoHidden.value = this.getAttribute('data-value')
            dropdownOptionsIndicativo.classList.remove('open')
        })
    })
    document.addEventListener('click', function(event) {
        if (!dropdownContainerIndicativo.contains(event.target)) {
            dropdownOptionsIndicativo.classList.remove('open')
        }
    })

    //--- Dropdown do assunto ---
    dropdownAssuntoSelected.addEventListener('click', function(event) {
        dropdownAssuntoOptions.classList.toggle('open')
        event.stopPropagation()
    })

    const opcoesAssunto = dropdownAssuntoOptions.querySelectorAll('li')
    opcoesAssunto.forEach(function(opcao) {
        opcao.addEventListener('click', function() {
            const assunto = this.getAttribute('data-value')
            dropdownAssuntoSelected.textContent = this.textContent
            inputAssuntoHidden.value = assunto
            mensagemEscrita.value = mensagemPreDefinida[assunto] || ''
            dropdownAssuntoOptions.classList.remove('open')
        })
    })

    document.addEventListener('click', function(event) {
        if (!dropdownAssuntoContainer.contains(event.target)) {
            dropdownAssuntoOptions.classList.remove('open')
        }
    })

    // --- Carrosel ---
    // Initializes the main carousel by cloning the first and last slides for infinite looping.
    function initCarousel() {
        // Clone Last Image (Prepended)
        const cloneLast = document.createElement("div")
        cloneLast.classList.add("carousel-slide")
        cloneLast.style.backgroundImage = `url('${imagens[imagens.length - 1]}')`
        cloneLast.id = 'last-clone'
        track.appendChild(cloneLast)

        // Real Images
        imagens.forEach((img) => {
            const slide = document.createElement("div")
            slide.classList.add("carousel-slide")
            slide.style.backgroundImage = `url('${img}')`
            track.appendChild(slide)
        })

        // Clone First Image (Appended)
        const cloneFirst = document.createElement("div")
        cloneFirst.classList.add("carousel-slide")
        cloneFirst.style.backgroundImage = `url('${imagens[0]}')`
        cloneFirst.id = 'first-clone'
        track.appendChild(cloneFirst)

        // Initial Position
        track.style.transform = `translateX(-${indiceAtual * 100}%)`
    }

    // Handles the slide navigation (next/prev), updates the index, and applies the CSS transform.
    function mudarImagem(direcao) {
        if (isTransitioning) return
        track.style.transition = 'transform 0.5s ease-in-out'
        isTransitioning = true

        if (direcao === 'next') {
            indiceAtual++
        } else {
            indiceAtual--
        }
        track.style.transform = `translateX(-${indiceAtual * 100}%)`
    } 

    // Resets the position without transition when reaching cloned slides to maintain the infinite loop illusion.
    function handleCarouselTransition() {
        isTransitioning = false
        const slides = document.querySelectorAll('.carousel-slide')
        
        if (slides[indiceAtual].id === 'last-clone') {
            track.style.transition = 'none'
            indiceAtual = slides.length - 2
            track.style.transform = `translateX(-${indiceAtual * 100}%)`
        }
        if (slides[indiceAtual].id === 'first-clone') {
            track.style.transition = 'none'
            indiceAtual = 1
            track.style.transform = `translateX(-${indiceAtual * 100}%)`
        }
    }
    
 //Changes scroll to top button, as user scrolls down
    function scrollPos(){
       const alturaTotal = document.documentElement.scrollHeight - window.innerHeight
       const percentagemScroll = (window.scrollY / alturaTotal) * 100
         if (percentagemScroll > 10 ) { //Makes the button show up when user scrolls past header
            toTopbtn.style.display = "block"
            toTopbtn.style.color = 'white'

            if (percentagemScroll > 90){ //Changes the color of the button as soon as user goes near the footer that is a darker color
             toTopbtn.style.backgroundColor = 'white'
             toTopbtn.style.color = 'black'
            }
            else{
             toTopbtn.style.backgroundColor = "var(--accent-color)"
            }
          }
          else {
             toTopbtn.style.display = "none"
          }
    }

     //Makes user go to top of the page
    function voltarAoTopo() {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    }

    // --- Theme ---
    // Sets the visual theme, updates the toggle button icon, and saves the preference to localStorage.
    function setTheme(theme) {
        htmlEl.setAttribute('data-theme', theme)
        themeToggleBtn.textContent = theme === 'dark' ? sunIcon : moonIcon
        localStorage.setItem('theme', theme)
    }

    // Toggles between 'light' and 'dark' modes based on the current state.
    function toggleTheme() {
        const newTheme = htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
        setTheme(newTheme)
    }

    // Initializes the theme on page load, checking localStorage or system preference.
    function initTheme() {
        const savedTheme = localStorage.getItem('theme')
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        const currentTheme = savedTheme || (prefersDark ? 'dark' : 'light')
        setTheme(currentTheme)
    }

    // --- Eventos Carousel ---
    // Initializes the specific logic for the Events carousel (sliding cards based on width).
    window.initEventCarousel = function() {
        const eventTrack = document.querySelector('.events-track')
        const eventWrapper = document.querySelector('.events-mask')
        const eventNextBtn = document.getElementById('event-next')
        const eventPrevBtn = document.getElementById('event-prev')
        const eventCards = document.querySelectorAll('.event-card')

        if (!eventTrack || eventCards.length === 0) return

        let eventIndex = 0

        // Updates the visual position of the carousel based on the current index and card width
        function updateEventCarousel() {
            const cardWidth = eventCards[0].offsetWidth
            const style = window.getComputedStyle(eventTrack)
            const gap = parseFloat(style.gap) || 0
            const slideWidth = cardWidth + gap
            const maxTranslate = Math.max(0, eventTrack.scrollWidth - eventWrapper.offsetWidth) 
            let translateX = eventIndex * slideWidth
            
            // Clamp translation to avoid dead space at the end
            if (translateX > maxTranslate) {
                translateX = maxTranslate
            }
            
            eventTrack.style.transform = `translateX(-${translateX}px)`
        }

        const newNextBtn = eventNextBtn.cloneNode(true)
        eventNextBtn.parentNode.replaceChild(newNextBtn, eventNextBtn)
        const newPrevBtn = eventPrevBtn.cloneNode(true)
        eventPrevBtn.parentNode.replaceChild(newPrevBtn, eventPrevBtn)
        // Event listener for the "Next" button: calculates boundaries and advances if possible
        newNextBtn.addEventListener('click', () => {
            const cardWidth = eventCards[0].offsetWidth
            const style = window.getComputedStyle(eventTrack)
            const gap = parseFloat(style.gap) || 0
            const maxTranslate = Math.max(0, eventTrack.scrollWidth - eventWrapper.offsetWidth)

            if (eventIndex * (cardWidth + gap) < maxTranslate) {
                eventIndex++
                updateEventCarousel()
            }
        })
        // Event listener for the "Previous" button: decreases index if not at the start
        newPrevBtn.addEventListener('click', () => {
            if (eventIndex > 0) eventIndex--
            updateEventCarousel()
        })

        window.addEventListener('resize', updateEventCarousel)
    }

    /* 
    INITIALIZATION & EVENT LISTENERS
    */
    
    // Initialize Logic
    initCarousel()
    initTheme()
    initEventCarousel()

    // Add Listeners
    track.addEventListener('transitionend', handleCarouselTransition)
    btnNext.addEventListener("click", () => mudarImagem('next'))
    btnPrev.addEventListener("click", () => mudarImagem('prev'))
    window.addEventListener("scroll", scrollPos)
    toTopbtn.addEventListener("click", voltarAoTopo)
    themeToggleBtn.addEventListener('click', toggleTheme)
    headerBtn.addEventListener('click', toggleMenu)
    
    navItems.forEach(link => {
        link.addEventListener('click', () => {
            menuLinks.classList.remove('active')
        })
    })
    form.addEventListener("submit", validadeForm)
        // Listener do Formulário de Gestão de Eventos
    if (formGestaoEvento) {
    formGestaoEvento.addEventListener("submit", async (e) => {
        e.preventDefault(); // Impede o recarregamento da página

        // Limpa mensagens anteriores
        feedbackGestao.textContent = ""
        feedbackGestao.style.color = "initial"

        try {
            if (!db) {
                throw new Error("Base de dados não está pronta. Tente de novo.")
            }

            let mensagem

            if (eventoEmEdicao) {
                // EDITAR EVENTO
                eventoEmEdicao.titulo = inputGestaoTitulo.value.trim()
                eventoEmEdicao.descricao = inputGestaoDescricao.value.trim()
                eventoEmEdicao.data = inputGestaoData.value
                eventoEmEdicao.hora = inputGestaoHora.value
                eventoEmEdicao.local = inputGestaoLocal.value.trim()
                eventoEmEdicao.imagem = inputGestaoImagem.value.trim()

                mensagem = await updateEventDB(db, eventoEmEdicao)

                eventoEmEdicao = null // sai do modo edição

            } else {
                // ADICIONAR EVENTO 
                const novoEvento = new Evento(
                    inputGestaoTitulo.value.trim(),
                    inputGestaoDescricao.value.trim(),
                    inputGestaoData.value,
                    inputGestaoHora.value,
                    inputGestaoLocal.value.trim(),
                    inputGestaoImagem.value.trim()
                )

                mensagem = await addEventDB(db, novoEvento)
            }

            // Feedback visual de sucesso
            feedbackGestao.textContent = "Sucesso: " + mensagem
            feedbackGestao.style.color = "green"

            formGestaoEvento.reset()

            await renderEventos()
            await renderListaAdmin()

        } catch (erro) {
            console.error(erro)
            feedbackGestao.textContent = "Erro ao guardar: " + erro.message
            feedbackGestao.style.color = "red"
        }
    })
}

    
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) { 
            setTheme(e.matches ? 'dark' : 'light')
        }
    })
})

async function startApp() {
    try {
        db = await startDB()
        console.log("Base de dados pronta")        
        await renderEventos()
    } catch (error){
        console.error(error)  
    }    
}
window.addEventListener("load", startApp)

async function renderEventos() {
    const trackDinamico = document.getElementById("track-eventos-dinamico")
    if (!trackDinamico) return // garante que exista contentor

    try {
        // retira os eventos da base de dados
        const eventos = await getEventosDB(db)
        // limpar 
        trackDinamico.innerHTML = ""
        // se o array estiver vazio, mostra mensagem
        if (eventos.length === 0) {
            const mensagem = document.createElement("p")
            mensagem.style.textAlign = "center"
            mensagem.style.width = "100%"
            mensagem.style.padding = "2rem"
            mensagem.textContent = "Ainda não existem eventos agendados."

            trackDinamico.appendChild(mensagem)
            return
        }
    
    for (const evento of eventos) {
        const data = new Date(evento.data)
            const dia = data.getDate()
            const meses = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"]
            const mes = meses[data.getMonth()]
            const previsao = await obterPrevisaoEvento(evento.local, evento.data)
            const article = document.createElement("article")
            article.classList.add("event-card")

            // EVENTO
            const cardImage = document.createElement("div")
            cardImage.classList.add("card-image")

            const img = document.createElement("img")
            img.src = evento.imagem || "./media/evento1.png"

            const dateBadge = document.createElement("div")
            dateBadge.classList.add("date-badge")

            const spanDia = document.createElement("span")
            spanDia.classList.add("day")
            spanDia.textContent = dia

            const spanMes = document.createElement("span")
            spanMes.classList.add("month")
            spanMes.textContent = mes

            dateBadge.appendChild(spanDia)
            dateBadge.appendChild(spanMes)

            cardImage.appendChild(img)
            cardImage.appendChild(dateBadge)

            // INTERNO EVENTO CONTEUDO 
            const cardContent = document.createElement("div")
            cardContent.classList.add("card-content")

            const titulo = document.createElement("h4")
            titulo.textContent = evento.titulo

            const hora = document.createElement("p")
            hora.classList.add("meta")
            hora.textContent = `🕒 ${evento.hora}`

            const local = document.createElement("p")
            local.classList.add("meta")
            local.textContent = `📍 ${evento.local}`

            const previsaoTexto = document.createElement("p")
            previsaoTexto.classList.add("meta")
            previsaoTexto.innerHTML = `Previsão: ${previsao}`

            const descricao = document.createElement("p")
            descricao.textContent = evento.descricao

            const adminButtons = document.createElement("div")
            adminButtons.classList.add("admin-buttons")
            adminButtons.style.display = "none"

            const btnEditar = document.createElement("button")
            btnEditar.textContent = "Editar"
            btnEditar.onclick = () => editarEvento(evento.id)

            const btnRemover = document.createElement("button")
            btnRemover.textContent = "Remover"
            btnRemover.onclick = () => removerEvento(evento.id)

            adminButtons.appendChild(btnEditar)
            adminButtons.appendChild(btnRemover)

            cardContent.appendChild(titulo)
            cardContent.appendChild(hora)
            cardContent.appendChild(local)
            cardContent.appendChild(previsaoTexto)
            cardContent.appendChild(descricao)
            cardContent.appendChild(adminButtons)

            article.appendChild(cardImage)
            article.appendChild(cardContent)

            article.addEventListener("click", () => {
                adminButtons.style.display =
                    adminButtons.style.display === "none" ? "block" : "none"
            })

            trackDinamico.appendChild(article)
        }

        initEventCarousel()
        } catch (error) {
        console.error(error)
    }
}
window.renderListaAdmin = async function() {
    const lista = document.getElementById("lista-eventos-admin")
    if (!lista) return

    const eventos = await getEventosDB(db)
    lista.innerHTML = ""

    if (eventos.length === 0) {
        lista.innerHTML = "<p style='padding:1rem; color:grey;'>A base de dados está vazia.</p>"
        return;
    }

    eventos.forEach(ev => {
        const item = document.createElement("div")
         item.style = "display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #eee; background: rgba(0,0,0,0.02); margin-bottom: 5px; border-radius: 5px;"

    // evento
    const info = document.createElement("div")

    const titulo = document.createElement("strong")
    titulo.style.color = "var(--primary-color)"
    titulo.textContent = ev.titulo

    const quebraLinha = document.createElement("br")

    const detalhes = document.createElement("small")
    detalhes.textContent = `${ev.data} em ${ev.local}`

    info.appendChild(titulo)
    info.appendChild(quebraLinha)
    info.appendChild(detalhes)

    // crud eventos
    const botoes = document.createElement("div")
    botoes.style = "display: flex; gap: 5px;"

    const btnEditar = document.createElement("button")
    btnEditar.textContent = "Editar"
    btnEditar.onclick = () => editarEvento(ev.id)
    btnEditar.style = "background: var(--accent-color1); color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 4px;"

    const btnRemover = document.createElement("button")
    btnRemover.textContent = "Remover"
    btnRemover.onclick = () => removerEvento(ev.id)
    btnRemover.style = "background: #ff4d4d; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 4px;"

    botoes.appendChild(btnEditar)
    botoes.appendChild(btnRemover)

    item.appendChild(info)
    item.appendChild(botoes)

    lista.appendChild(item)
})
}
/*EDITAR EVENTO */
window.editarEvento = async function(id) {
    const eventos = await getEventosDB(db)
    const evento = eventos.find(e => e.id === id)

    if (!evento) return

    document.getElementById("evento-titulo").value = evento.titulo
    document.getElementById("evento-descricao").value = evento.descricao
    document.getElementById("evento-data").value = evento.data
    document.getElementById("evento-hora").value = evento.hora
    document.getElementById("evento-local").value = evento.local
    document.getElementById("evento-imagem").value = evento.imagem || ""

    eventoEmEdicao = evento
    document.getElementById("admin-titulo").textContent = "Editar Evento"
    document.getElementById("btn-submit-admin").textContent = "Guardar Alterações";
    document.getElementById("btn-cancelar-edicao").style.display = "block"
}
/*Remover EVENTO */
window.removerEvento = async function(id) {
    if (!confirm("Apagar evento?")) return
    await deleteEventDB(db, id)
    await renderEventos()
    await renderListaAdmin()
}