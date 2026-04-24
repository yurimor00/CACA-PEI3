export async function obterPrevisaoEvento(local, dataEvento) {

    if (!local || local.trim() === "") return "wi wi-day-cloudy";
    try {
        const urlGeocoding = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(local)}&count=1&language=pt`
        const respostaGeo = await fetch(urlGeocoding)
        const dadosGeo = await respostaGeo.json()
        if (!dadosGeo.results || dadosGeo.results.length === 0) {
            return "Local não encontrado"
        }
        const lat = dadosGeo.results[0].latitude
        const lon = dadosGeo.results[0].longitude

        const hoje = new Date()
        const dataEv = new Date(dataEvento)
        const diferencaDias = Math.ceil((dataEv - hoje) / (1000 * 60 * 60 * 24))
        if (diferencaDias < 0 || diferencaDias > 14) {
            return "Previsão disponível apenas para eventos nos próximos 14 dias"
        }
        const urlMeteo = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,weathercode&start_date=${dataEvento}&end_date=${dataEvento}&timezone=auto`     
        const respostaMeteo = await fetch(urlMeteo)
        const dadosMeteo = await respostaMeteo.json()        
        if (!dadosMeteo.daily) return "wi wi-day-cloudy";
        const tempMax = dadosMeteo.daily.temperature_2m_max[0]
        const codigo = dadosMeteo.daily.weathercode[0]

        let emoji = "wi wi-cloud";
        if (codigo <= 3) emoji = "wi wi-day-sunny";
        else if (codigo >= 51 && codigo <= 67) emoji = "wi wi-rain";
        else if (codigo >= 71 && codigo <= 77) emoji = "wi-snow";
        return `<i class="wi ${emoji}"></i> ${Math.round(tempMax)}°C`;
    } catch (error) {
        console.error("Erro ao obter previsão:", error)
        return "Previsão indisponível"
    }
}