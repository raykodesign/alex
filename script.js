document.addEventListener('DOMContentLoaded', () => {
    
    // --- EFECTO MOUSE (Flechas y Rayos) ---
    let throttle = false;
    document.addEventListener('mousemove', (e) => {
        if(throttle) return;
        throttle = true;
        setTimeout(() => throttle = false, 50);

        const magicEl = document.createElement('div');
        magicEl.classList.add('magic-heart'); // Usa estilos existentes
        // Emojis varoniles y abstractos
        const shapes = ['⚡', '💠', '🔹']; 
        const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
        
        magicEl.innerHTML = randomShape;
        magicEl.style.left = (e.pageX + 10) + 'px';
        magicEl.style.top = (e.pageY + 10) + 'px';
        magicEl.style.position = 'absolute';
        magicEl.style.pointerEvents = 'none';
        magicEl.style.color = '#00f3ff';
        magicEl.style.textShadow = "0 0 5px #00f3ff";
        magicEl.style.fontSize = "14px";
        magicEl.style.animation = "floatUp 0.8s ease-out forwards";

        document.body.appendChild(magicEl);
        setTimeout(() => { magicEl.remove(); }, 800);
    });

    // --- VARIABLES Y SELECTORES ---
    const enterScreen = document.getElementById('enter-screen');
    const enterBtn = document.getElementById('enter-btn');
    const mainLayout = document.getElementById('main-layout');
    const typingText = document.getElementById('typing-text');
    
    // MUSICA
    const audioPlayer = document.getElementById('audio');
    const vinyl = document.getElementById('vinyl');
    const playIcon = document.getElementById('play-icon');
    const songTitle = document.getElementById('song-title');
    const songArtist = document.getElementById('song-artist');
    const progressBar = document.getElementById('progress-bar');

    // ASEGÚRATE QUE EL NOMBRE DEL ARCHIVO SEA CORRECTO
    const songs = [
        {
            title: "Tu mano", 
            artist: "Alex Castro",
            src: "audio/Alex Castro - Tu Mano.mp3" 
        }
    ];

    let currentSongIndex = 0;

    function loadSong(index) {
        if (!songs.length) return;
        const song = songs[index];
        if(songTitle) songTitle.innerText = song.title;
        if(songArtist) songArtist.innerText = song.artist;
        if(audioPlayer) audioPlayer.src = song.src;
    }

    window.togglePlay = function() {
        if(!audioPlayer) return;
        if (audioPlayer.paused) {
            audioPlayer.play().then(() => {
                if(playIcon) {
                    playIcon.classList.remove('fa-play');
                    playIcon.classList.add('fa-pause');
                }
                if(vinyl) vinyl.classList.add('spinning');
            }).catch(e => {
                console.log("Error play:", e);
                // Si falla, es probable que la ruta del mp3 este mal
            });
        } else {
            audioPlayer.pause();
            if(playIcon) {
                playIcon.classList.remove('fa-pause');
                playIcon.classList.add('fa-play');
            }
            if(vinyl) vinyl.classList.remove('spinning');
        }
    };

    window.nextSong = function() {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        loadSong(currentSongIndex);
        setTimeout(() => window.togglePlay(), 300);
    };

    window.prevSong = function() {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        loadSong(currentSongIndex);
        setTimeout(() => window.togglePlay(), 300);
    };

    if(audioPlayer) {
        audioPlayer.addEventListener('timeupdate', (e) => {
            const { duration, currentTime } = e.srcElement;
            const progressPercent = (currentTime / duration) * 100;
            if(progressBar) progressBar.style.width = `${progressPercent}%`;
        });
    }

    // Inicializar primera canción
    loadSong(currentSongIndex);

    // --- EVENTO DE ENTRADA (Música + Animación) ---
    enterBtn.addEventListener('click', () => {
        enterScreen.style.opacity = '0';
        mainLayout.style.display = 'flex';
        
        // Reproducir musica al click (necesario por politicas de navegador)
        if(audioPlayer) {
            audioPlayer.volume = 0.5;
            window.togglePlay();
        }

        setTimeout(() => {
            enterScreen.style.display = 'none'; 
            mainLayout.classList.remove('hidden-layout'); 
            
            // CAMBIO: Activamos la animación de los botones
            const navMenu = document.querySelector('.nav-menu');
            if(navMenu) navMenu.classList.add('start-anim');
            
            initTypewriter();
        }, 800);
    });

    // --- MAQUINA DE ESCRIBIR ---
    const welcomeMsg = "Sonrío y soy feliz, no porque mi vida sea perfecta, sino porque aprecio mucho lo que Dios me ha dado cada día.";
    function initTypewriter() {
        if(!typingText) return;
        let i = 0;
        typingText.innerHTML = "";
        function type() {
            if (i < welcomeMsg.length) {
                typingText.innerHTML += welcomeMsg.charAt(i);
                i++;
                setTimeout(type, 50); 
            }
        }
        type();
    }

    // --- LOGICA DE MODALES ---
    window.openModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if(modal) {
            modal.classList.add('active');
            if(modalId === 'modal-gallery') setTimeout(updateGallery3D, 100);
        }
    };

    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if(modal) modal.classList.remove('active');
    };
    
    window.onclick = (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    };

    // --- GALERIA 3D ---
    const galleryImages = [
        "https://xatimg.com/image/J4OIVXYR5pum.jpg",
    ];
    
    const carouselTrack = document.getElementById('carousel-3d-track');
    let galleryIndex = 0; 

    if(carouselTrack) {
        carouselTrack.innerHTML = "";
        galleryImages.forEach((src, i) => {
            const card = document.createElement('div');
            card.className = 'card-3d-gold';
            card.innerHTML = `<img src="${src}" alt="Img ${i}">`;
            card.onclick = () => { galleryIndex = i; updateGallery3D(); };
            carouselTrack.appendChild(card);
        });
    }

    window.updateGallery3D = () => {
        const cards = document.querySelectorAll('.card-3d-gold');
        if(!cards.length) return;
        
        cards.forEach(c => c.classList.remove('active'));
        if(cards[galleryIndex]) cards[galleryIndex].classList.add('active');

        const container = document.querySelector('.gallery-container-3d');
        if(!container) return;
        
        const centerX = container.offsetWidth / 2;
        const cardWidth = 200 + 40; // Ancho carta + margen
        const offset = centerX - (galleryIndex * cardWidth) - (200/2);

        if(carouselTrack) carouselTrack.style.transform = `translateX(${offset}px)`;
    };

    window.moveGallery = (dir) => {
        galleryIndex += dir;
        if(galleryIndex < 0) galleryIndex = galleryImages.length - 1;
        if(galleryIndex >= galleryImages.length) galleryIndex = 0;
        updateGallery3D();
    };

    window.addEventListener('resize', updateGallery3D);
});
