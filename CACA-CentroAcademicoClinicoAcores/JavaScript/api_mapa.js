window.initMap = function() {
    const universidadeAcores = { lat: 37.7461333, lng: -25.6638178 }; 

    const mapa = new google.maps.Map(document.getElementById("map"), {
        center: universidadeAcores,
        zoom: 15,
    });

    const marker = new google.maps.Marker({
        position: universidadeAcores,
        map: mapa,
        title: "Universidade dos Açores"
    });
};

(function loadGoogleMapsAPI() {
    if (document.querySelector('script[src*="maps.googleapis.com"]')) return;

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API.GOOGLE_MAPS_KEY}&libraries=places&callback=initMap&loading=async`;
    script.async = true;
    script.defer = true;
    
    script.onerror = function() {
        console.error("Erro ao carregar a Google Maps API. Verifica a tua chave.");
    };

    document.head.appendChild(script);
})();