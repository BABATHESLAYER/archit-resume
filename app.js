// JavaScript for Archit Gaware's Parlor Resume Portfolio

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const dialogueElement = document.getElementById('dialogue-text');
    const btnMelody = document.getElementById('btn-melody');
    const btnSparkle = document.getElementById('btn-sparkle');
    const btnCrt = document.getElementById('btn-crt');
    const btnFloat = document.getElementById('btn-float');
    const windowContainer = document.getElementById('widget-window');
    
    const scoopGcp = document.getElementById('scoop-gcp');
    const scoopAzure = document.getElementById('scoop-azure');
    const scoopAws = document.getElementById('scoop-aws');
    
    const cardGcp = document.getElementById('card-gcp');
    const cardAzure = document.getElementById('card-azure');
    const cardAws = document.getElementById('card-aws');
    
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.scroll-section');

    // Dialogues
    const welcomeText = "Welcome to CLOUD SCOOPS parlor! Walk up to the counter and click a flavor to taste Archit's cloud experience.";
    
    const cloudDialogues = {
        gcp: "Archit orders a scoop of GCP Cotton Candy! Mmm, sweet and smooth. Rating: 3.5/5. Bro, my GCP experience is literally hackathon-based and GDG cohort-based. I hold the Google Cloud Cybersecurity Certificate, have 42 Skill Badges, and 12 Google Developer Badges!",
        azure: "Archit orders a scoop of Azure Blueberry Mint! Chilly, crisp, and reliable. Rating: 4/5. Learned cloud and DevOps from skills mentor Shubham Londhe during the SysTech travel ERP internship in the trenches, plus co-led community cloud projects!",
        aws: "Archit orders a scoop of AWS Orange Creamsicle! A classic flavor with zesty features. Rating: 3/5. Selected as an AWS AI & ML Scholar (2026 Challenge Completion). Curated AWS solutions and coordinated flows as part of the Tech Team in the Cloud Computing Club!"
    };

    let isTyping = false;
    let audioCtx = null;
    let melodyInterval = null;
    let isMelodyPlaying = false;
    let typewriterTimeoutId = null;

    // Typewriter effect
    function typeWriter(text, index = 0) {
        if (index === 0) {
            if (typewriterTimeoutId) {
                clearTimeout(typewriterTimeoutId);
            }
            dialogueElement.innerHTML = '';
            isTyping = true;
        }

        if (index < text.length) {
            const char = text[index];
            dialogueElement.innerHTML += char;
            
            // Play a subtle high-pitched bleep sound for typing
            if (index % 2 === 0) {
                playBleep();
            }
            
            typewriterTimeoutId = setTimeout(() => {
                typeWriter(text, index + 1);
            }, 30); // Quick typing speed
        } else {
            isTyping = false;
            typewriterTimeoutId = null;
        }
    }

    // Initialize Web Audio Context
    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    // Play retro typing bleep
    function playBleep() {
        if (!audioCtx) return;
        
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(900 + Math.random() * 200, now);
        
        gain.gain.setValueAtTime(0.015, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start(now);
        osc.stop(now + 0.04);
    }

    // Play unique 8-bit arpeggios based on flavor
    function playFlavorSound(cloudType) {
        initAudio();
        if (!audioCtx) return;

        const now = audioCtx.currentTime;
        
        const playTone = (freq, time, duration, type = 'triangle') => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            osc.type = type;
            osc.frequency.setValueAtTime(freq, time);
            
            gain.gain.setValueAtTime(0.08, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.start(time);
            osc.stop(time + duration);
        };

        if (cloudType === 'gcp') {
            // Sweet Cotton Candy (Pentatonic High Sweep)
            playTone(587.33, now, 0.2);        // D5
            playTone(659.25, now + 0.08, 0.2);  // E5
            playTone(783.99, now + 0.16, 0.2);  // G5
            playTone(880.00, now + 0.24, 0.2);  // A5
            playTone(1174.66, now + 0.32, 0.4); // D6
        } else if (cloudType === 'azure') {
            // Chilly Blueberry Mint (Cool major chord arpeggio)
            playTone(523.25, now, 0.25);       // C5
            playTone(659.25, now + 0.08, 0.25); // E5
            playTone(783.99, now + 0.16, 0.25); // G5
            playTone(1046.50, now + 0.24, 0.4); // C6
        } else if (cloudType === 'aws') {
            // Zesty Orange Creamsicle (Major-seventh arpeggio)
            playTone(493.88, now, 0.2);        // B4
            playTone(587.33, now + 0.08, 0.2);  // D5
            playTone(739.99, now + 0.16, 0.2);  // F#5
            playTone(880.00, now + 0.24, 0.2);  // A5
            playTone(987.77, now + 0.32, 0.4);  // B5
        }
    }

    // Play background melody loop
    function startMelodyProgression() {
        initAudio();
        if (!audioCtx) return;

        isMelodyPlaying = true;
        btnMelody.innerHTML = "🎵 MUSIC OFF";
        btnMelody.style.background = "var(--white)";
        btnMelody.style.color = "var(--hot-pink)";

        let bar = 0;
        const notes = [
            [523.25, 659.25, 783.99, 987.77], // C Maj7
            [587.33, 698.46, 880.00, 1046.50], // D min7
            [698.46, 880.00, 1046.50, 1318.51], // F Maj7
            [783.99, 987.77, 1174.66, 1396.91]  // G7
        ];

        function playArpeggio() {
            const chord = notes[bar % notes.length];
            const now = audioCtx.currentTime;
            
            chord.forEach((freq, i) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, now + i * 0.15);
                
                // Retro pitch vibrato
                const lfo = audioCtx.createOscillator();
                const lfoGain = audioCtx.createGain();
                lfo.frequency.value = 5; 
                lfoGain.gain.value = 6;  
                lfo.connect(lfoGain);
                lfoGain.connect(osc.frequency);
                
                gain.gain.setValueAtTime(0.03, now + i * 0.15);
                gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.45);
                
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                
                lfo.start(now + i * 0.15);
                osc.start(now + i * 0.15);
                
                lfo.stop(now + i * 0.15 + 0.5);
                osc.stop(now + i * 0.15 + 0.5);
            });
            bar++;
        }

        playArpeggio();
        melodyInterval = setInterval(playArpeggio, 1400);
    }

    function stopMelodyProgression() {
        isMelodyPlaying = false;
        clearInterval(melodyInterval);
        btnMelody.innerHTML = "🎵 MUSIC ON";
        btnMelody.style.background = "var(--pastel-pink)";
        btnMelody.style.color = "var(--deep-berry)";
    }

    // Sparkle Particle Burst Effect
    function createSparkleBurst(x, y) {
        const numParticles = 12;
        for (let i = 0; i < numParticles; i++) {
            const particle = document.createElement('div');
            particle.classList.add('sparkle-burst');
            
            const angle = Math.random() * Math.PI * 2;
            const distance = 30 + Math.random() * 70;
            
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            
            particle.style.setProperty('--tx', `${tx}px`);
            particle.style.setProperty('--ty', `${ty}px`);
            
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            
            const colors = ['#ffffff', '#ffccd5', '#ffc2d1', '#ffb3c1', '#ff4d6d', '#fff3b0', '#bde0fe', '#ffe0b2'];
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            document.body.appendChild(particle);
            
            particle.addEventListener('animationend', () => {
                particle.remove();
            });
        }
    }

    // Interactive Cloud Scoop Tasting Events
    function tasteCloud(cloudType, clientX, clientY) {
        playFlavorSound(cloudType);
        createSparkleBurst(clientX, clientY);
        typeWriter(cloudDialogues[cloudType]);
        
        // Remove active class from all cards, add to target card, and pulse it
        [cardGcp, cardAzure, cardAws].forEach(c => c.classList.remove('active-pulse'));
        
        let targetCard = null;
        if (cloudType === 'gcp') targetCard = cardGcp;
        if (cloudType === 'azure') targetCard = cardAzure;
        if (cloudType === 'aws') targetCard = cardAws;
        
        if (targetCard) {
            targetCard.classList.add('active-pulse');
            setTimeout(() => {
                targetCard.classList.remove('active-pulse');
            }, 3000);
        }
    }

    scoopGcp.addEventListener('click', (e) => tasteCloud('gcp', e.clientX, e.clientY));
    scoopAzure.addEventListener('click', (e) => tasteCloud('azure', e.clientX, e.clientY));
    scoopAws.addEventListener('click', (e) => tasteCloud('aws', e.clientX, e.clientY));
    
    // Accessibility keyboard support
    [scoopGcp, scoopAzure, scoopAws].forEach(scoop => {
        scoop.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const rect = scoop.getBoundingClientRect();
                tasteCloud(scoop.dataset.cloud, rect.left + rect.width/2, rect.top + rect.height/2);
            }
        });
    });

    // Navigation scroll tracking active state (optimized to avoid layout thrashing and scrolling lag)
    let isScrolling = false;
    let sectionPositions = [];

    function updateSectionPositions() {
        sectionPositions = Array.from(sections).map(section => ({
            id: section.getAttribute('id'),
            top: section.offsetTop
        }));
    }

    // Cache positions initially and update on resize
    updateSectionPositions();
    window.addEventListener('resize', updateSectionPositions);

    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                let currentSectionId = '';
                const scrollPos = window.pageYOffset || document.documentElement.scrollTop;

                for (let i = 0; i < sectionPositions.length; i++) {
                    const sec = sectionPositions[i];
                    if (scrollPos >= (sec.top - 120)) {
                        currentSectionId = sec.id;
                    }
                }

                // Corner case: if we scrolled past the last section or near the reviews section
                // map reviews to parlor link as they represent the tasting notes
                if (currentSectionId === 'reviews') {
                    currentSectionId = 'parlor';
                }

                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentSectionId}`) {
                        link.classList.add('active');
                    }
                });

                isScrolling = false;
            });
            isScrolling = true;
        }
    });

    // Spawn Magic from center screen
    btnSparkle.addEventListener('click', (e) => {
        initAudio();
        playFlavorSound('azure');
        const rect = windowContainer.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        createSparkleBurst(x, y);

        // Spawn a floating heart/sparkle
        const floatingHeart = document.createElement('div');
        floatingHeart.classList.add('sparkle-particle');
        floatingHeart.innerHTML = ['💖', '✨', '🌸', '🍦', '🍧'][Math.floor(Math.random() * 5)];
        floatingHeart.style.left = `${10 + Math.random() * 80}%`;
        floatingHeart.style.top = `${window.scrollY + 100 + Math.random() * 400}px`;
        floatingHeart.style.animationDelay = '0s';
        document.body.appendChild(floatingHeart);

        setTimeout(() => floatingHeart.remove(), 6000);
    });

    // Music toggle
    btnMelody.addEventListener('click', (e) => {
        initAudio();
        if (isMelodyPlaying) {
            stopMelodyProgression();
        } else {
            startMelodyProgression();
        }
        createSparkleBurst(e.clientX, e.clientY);
    });

    // CRT Toggle
    btnCrt.addEventListener('click', (e) => {
        initAudio();
        playBleep();
        document.body.classList.toggle('crt-disabled');
        btnCrt.innerHTML = document.body.classList.contains('crt-disabled') ? "📺 CRT OFF" : "📺 CRT ON";
        createSparkleBurst(e.clientX, e.clientY);
    });

    // Float Toggle
    btnFloat.addEventListener('click', (e) => {
        initAudio();
        playBleep();
        if (windowContainer.style.animationPlayState === 'paused') {
            windowContainer.style.animationPlayState = 'running';
            btnFloat.innerHTML = "🛸 FLOAT ON";
        } else {
            windowContainer.style.animationPlayState = 'paused';
            btnFloat.innerHTML = "🛸 FLOAT OFF";
        }
        createSparkleBurst(e.clientX, e.clientY);
    });

    // Click anywhere to spawn sparkles (only on backgrounds or cards)
    document.body.addEventListener('click', (e) => {
        if (e.target === document.body || e.target.classList.contains('sphere-3d') || e.target.classList.contains('sparkle-particle')) {
            initAudio();
            createSparkleBurst(e.clientX, e.clientY);
        }
    });

    // ==========================================
    // PHOTO_VIEWER.EXE RETRO MODAL LOGIC
    // ==========================================
    const photoViewerModal = document.getElementById('photo-viewer-modal');
    const viewerImg = document.getElementById('viewer-img');
    const viewerCaption = document.getElementById('viewer-caption');
    const viewerTitle = document.getElementById('viewer-window').querySelector('.window-titlebar span');
    const viewerClose = document.getElementById('viewer-close');
    const viewerCloseBtn = document.getElementById('viewer-close-btn');
    const btnZoomIn = document.getElementById('viewer-zoom-in');
    const btnZoomOut = document.getElementById('viewer-zoom-out');

    let currentZoom = 1.0;

    const imageDatabase = {
        // Nirmitivedh Sign Language
        'nirmitivedh-award': {
            title: 'PROJECT_EXCELLENCE_AWARD.EXE',
            src: 'images/nirmitivedh/PROJECT AWARD.jpg',
            caption: 'Archit receiving the Project Excellence Award for co-authoring and leading the Sign Language Translator project development at Nirmitivedh.'
        },
        'nirmitivedh-geotag': {
            title: 'PROJECT_GEOTAG.EXE',
            src: 'images/nirmitivedh/PROEJCT GEO TAG.jpg',
            caption: 'Archit demonstrating the Sign Language Translator project with integrated real-time location geo-tagging components.'
        },
        'nirmitivedh-cert': {
            title: 'NIRMITIVEDH_CERTIFICATE.EXE',
            src: 'images/nirmitivedh/certificate.jpg',
            caption: 'Official Nirmitivedh project competition certificate of participation from SOE Ajeenkya DY Patil University.'
        },
        // AutoTI
        'autoti-team': {
            title: 'AUTOTI_HACKATHON_TEAM.EXE',
            src: 'images/autoti/team.JPG',
            caption: 'The core technical team at the MIT ADT 24-hr Hackathon building the AutoTI agent. Absolute movie.'
        },
        'autoti-project': {
            title: 'AUTOTI_WORKING_MODEL.EXE',
            src: 'images/autoti/project.JPG',
            caption: 'AutoTI working hardware/software model capturing the intelligence pipelines.'
        },
        'autoti-hack-1': {
            title: 'AUTOTI_HACKATHON_24_PITCH.EXE',
            src: 'images/autoti/HACKTHON 24.jpg',
            caption: 'Archit Gaware presenting the Gemini and AlienVault threat intelligence pipelines to the hackathon judges.'
        },
        'autoti-hack-2': {
            title: 'AUTOTI_ARCHITECTURE_SHOWCASE.EXE',
            src: 'images/autoti/HACKTHON24 2.jpg',
            caption: 'AutoTI interactive system display and Dockerized agent architecture explanation.'
        },
        // SysTech Solutions ERP
        'erp-cert': {
            title: 'SYSTECH_ERP_CERTIFICATE.EXE',
            src: 'images/erp/certificate.jpeg',
            caption: 'SysTech Solutions internship completion certificate validating travel management ERP development.'
        },
        'erp-cab': {
            title: 'CAB_RELEASE_TRENCHES.EXE',
            src: 'images/erp/working in cab (prod issues fix devops).jpeg',
            caption: 'Fixing production issues and syncing devops releases inside a cab. Literal trenches!'
        },
        'erp-deploy': {
            title: 'ERP_DEPLOYMENT_COMPLETE.EXE',
            src: 'images/erp/deployment after devlopment.jpeg',
            caption: 'Successful travel management ERP application deployment milestone. Done and dusted!'
        },
        // Cloud Computing Club
        'cc-tech-team': {
            title: 'CC_CLUB_TECH_TEAM.EXE',
            src: 'images/cc club/TECH TEAM.JPG',
            caption: 'The core technical team members of the Cloud Computing Club, managing operations and solution architecture.'
        },
        'cc-poster': {
            title: 'AWS_CLUB_POSTER.EXE',
            src: 'images/cc club/cloud club poaster.png',
            caption: 'AWS Cloud Club promotion poster co-designed by Archit.'
        },
        'cc-catalyst': {
            title: 'CLUB_CATALYST_EVENT.EXE',
            src: 'images/cc club/club ctalyst.png',
            caption: 'Catalyst session organizing cloud workshops and flow architectures.'
        },
        'cc-help': {
            title: 'CCC_DOUBT_SOLVING.EXE',
            src: 'images/cc club/tech team at work.png',
            caption: 'Archit helping students and running doubt-solving sessions for the cloud cohort.'
        },
        // Smart India Hackathon
        'sih-jury': {
            title: 'SIH_JURY_COORDINATION.EXE',
            src: 'images/sih/JURY TEAM.JPG',
            caption: 'SIH Grand Final jury coordination team. 5 days * 24hr overnight shift survivors.'
        },
        // ProAzure Android Dev
        'proazure-dev': {
            title: 'PROAZURE_ANDROID_DEV.EXE',
            src: 'images/project/andorid.png',
            caption: 'Android user interface developed during Diploma internship at ProAzure.'
        },
        // Campus Memories
        'memories-bball-team': {
            title: 'BBALL_CHAMPIONS.EXE',
            src: 'images/sports/basktball team.jpg',
            caption: 'Inter-Department Basketball Tournament back-to-back winners! Teamwork, endurance, and solid defense.'
        },
        'memories-bball-trophy': {
            title: 'BBALL_TROPHY_LIFT.EXE',
            src: 'images/sports/trophy.jpg',
            caption: 'Lifting the championship trophy. Defending our title for the second consecutive year.'
        },
        'memories-bball-cert': {
            title: 'BBALL_CERTIFICATE.EXE',
            src: 'images/sports/certi with tophy.jpg',
            caption: 'Basketball tournament winner certificate and trophy presentation.'
        },
        'memories-media-award': {
            title: 'BEST_MEDIA_MANAGER.EXE',
            src: 'images/media/award.jpg',
            caption: 'Archit Gaware honored with the Best Media Manager Award, driving 258k+ content views!'
        },
        'memories-media-poster': {
            title: 'MEDIA_POSTER_DESIGN.EXE',
            src: 'images/media/poster.jpg',
            caption: 'A2R Media / BRB Media banner design project co-produced by Archit.'
        },
        // Radar Labs Projects
        'radar-farming-model': {
            title: 'FARMING_HARDWARE_MODEL.EXE',
            src: 'images/autoti/project.JPG',
            caption: 'ESP32 automated smart irrigation working hardware model with soil moisture sensor tray.'
        },
        'radar-farming-team': {
            title: 'FARMING_TEAM.EXE',
            src: 'images/autoti/team.JPG',
            caption: 'Farming project team at the Nirmitivedh competition.'
        },
        'radar-object-app': {
            title: 'RADAR_ANDROID_DEV.EXE',
            src: 'images/project/andorid.png',
            caption: 'Ultrasonic Radar Sweep: Android controller tracking coordinate targets.'
        },
        'radar-object-id': {
            title: 'RADAR_OBJECT_IDENTIFICATION.EXE',
            src: 'images/project/dashboard.png',
            caption: 'Radar Object Identification: Ultrasonic range mapping and Target mapping dashboard.'
        },
        // Existing GCP / AWS / Certs
        'gcp-2025': {
            title: 'GCP_CAMPAIGN_2025.EXE',
            src: 'images/GCP/GCP 2025 SWAGS.jpg',
            caption: 'GCP Study Jam and student Cloud Campaign milestone badge received in 2025.'
        },
        'gcp-2026': {
            title: 'GCP_MILESTONES_2026.EXE',
            src: 'images/GCP/GCP 2026 swags under gdg on campus.jpg',
            caption: 'Google Cloud developer pathways and learning campaign completion milestones achieved in 2026.'
        },
        'aws-champ': {
            title: 'AWS_CHAMPION.EXE',
            src: 'images/aws/AWS.jpg',
            caption: 'Archit Gaware honored as a leading member of the AWS Cloud Club community.'
        },
        'aws-scholar': {
            title: 'AWS_AI_ML_SCHOLAR.EXE',
            src: 'images/aws/AWS2.jpg',
            caption: 'AWS AI & ML Scholar Challenge certificate of completion.'
        },
        'cert-cyber': {
            title: 'GCP_CYBER_CERT.EXE',
            src: 'images/CERTI AND BADGES/cloud 101.png',
            caption: 'Google Cloud Cybersecurity Professional Certificate earned by Archit.'
        },
        'cert-gcp-30': {
            title: 'GCP_42_BADGES.EXE',
            src: 'images/CERTI AND BADGES/docker.png',
            caption: 'Diamond League topper verification and confirmation of completing 42 Google Cloud Skill Badges.'
        }
    };

    function playModalOpenSound() {
        initAudio();
        if (!audioCtx) return;
        const now = audioCtx.currentTime;
        // High-pitched arpeggio chime for file explorer opening
        const playTone = (freq, time, duration) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, time);
            gain.gain.setValueAtTime(0.04, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(time);
            osc.stop(time + duration);
        };
        playTone(659.25, now, 0.15); // E5
        playTone(880.00, now + 0.08, 0.15); // A5
        playTone(1046.50, now + 0.16, 0.25); // C6
    }

    function openPhotoViewer(imgId, x, y) {
        const item = imageDatabase[imgId];
        if (!item) return;

        viewerImg.src = item.src;
        viewerCaption.textContent = item.caption;
        viewerTitle.textContent = `🌸 ${item.title} 🌸`;
        
        // Reset Zoom
        currentZoom = 1.0;
        viewerImg.style.transform = 'scale(1)';

        // Open Modal
        photoViewerModal.classList.add('active');
        photoViewerModal.setAttribute('aria-hidden', 'false');
        
        playModalOpenSound();
        createSparkleBurst(x || window.innerWidth/2, y || window.innerHeight/2);
    }

    function closePhotoViewer() {
        photoViewerModal.classList.remove('active');
        photoViewerModal.setAttribute('aria-hidden', 'true');
        playBleep();
    }

    // Attach click listeners to cert buttons and polaroid view buttons
    document.body.addEventListener('click', (e) => {
        const target = e.target;
        const btn = target.closest('.btn-cert-view') || target.closest('.polaroid-view-btn');
        
        if (btn) {
            e.preventDefault();
            e.stopPropagation();
            
            const imgId = btn.getAttribute('data-img-id');
            if (imgId) {
                openPhotoViewer(imgId, e.clientX, e.clientY);
            }
        }
    });

    // Handle keypresses on accessible button elements and view buttons
    document.body.addEventListener('keydown', (e) => {
        const target = e.target;
        const btn = target.closest('.btn-cert-view') || target.closest('.polaroid-view-btn');
        
        if (btn && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            e.stopPropagation();
            
            const imgId = btn.getAttribute('data-img-id');
            const rect = btn.getBoundingClientRect();
            if (imgId) {
                openPhotoViewer(imgId, rect.left + rect.width / 2, rect.top + rect.height / 2);
            }
        }
    });

    // Close button events
    [viewerClose, viewerCloseBtn].forEach(el => {
        if (el) {
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                closePhotoViewer();
            });
        }
    });

    // Close on overlay backdrop click
    photoViewerModal.addEventListener('click', (e) => {
        if (e.target === photoViewerModal) {
            closePhotoViewer();
        }
    });

    // Escape key closes modal
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && photoViewerModal.classList.contains('active')) {
            closePhotoViewer();
        }
    });

    // Zoom Controls
    if (btnZoomIn) {
        btnZoomIn.addEventListener('click', (e) => {
            e.stopPropagation();
            initAudio();
            playBleep();
            currentZoom = Math.min(2.5, currentZoom + 0.2);
            viewerImg.style.transform = `scale(${currentZoom})`;
        });
    }

    if (btnZoomOut) {
        btnZoomOut.addEventListener('click', (e) => {
            e.stopPropagation();
            initAudio();
            playBleep();
            currentZoom = Math.max(0.5, currentZoom - 0.2);
            viewerImg.style.transform = `scale(${currentZoom})`;
        });
    }

    // ==========================================
    // INTERACTIVE POLAROID STACK GALLERY LOGIC
    // ==========================================
    
    function cycleCard(stack) {
        const cards = stack.querySelectorAll('.polaroid-card');
        if (cards.length < 2) return;
        
        const topCard = cards[0];
        if (topCard.classList.contains('swiping')) return;

        topCard.classList.add('swiping');
        
        // Organic transition sound
        initAudio();
        playBleep();

        // 1. Slide card out to the right
        topCard.style.transform = 'translate(140%, -15px) rotate(15deg)';
        topCard.style.opacity = '0';
        topCard.style.zIndex = '100';

        setTimeout(() => {
            // 2. Temporarily disable transitions, append to back of DOM stack
            topCard.style.transition = 'none';
            stack.appendChild(topCard);
            
            // Force reflow
            topCard.offsetHeight;
            
            // 3. Restore transition and slide it back in behind
            topCard.style.transition = '';
            topCard.style.transform = '';
            topCard.style.opacity = '';
            topCard.style.zIndex = '';
            
            setTimeout(() => {
                topCard.classList.remove('swiping');
            }, 350); // wait for slide-in to complete
        }, 350); // wait for slide-out to complete
    }

    // Initialize all stacked galleries
    const polaroidStacks = document.querySelectorAll('.polaroid-stack');
    polaroidStacks.forEach(stack => {
        let intervalId = null;

        function startAutoCycle() {
            if (!intervalId) {
                intervalId = setInterval(() => {
                    cycleCard(stack);
                }, 4000);
            }
        }

        function stopAutoCycle() {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
        }

        // Start cycling on load
        startAutoCycle();

        // Click to cycle
        stack.addEventListener('click', (e) => {
            // Ignore if clicked on the fullscreen button or cert badge view button
            if (e.target.closest('.polaroid-view-btn') || e.target.classList.contains('btn-cert-view')) {
                return;
            }
            e.preventDefault();
            cycleCard(stack);
        });

        // Keyboard Enter/Space support
        stack.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                if (e.target === stack) {
                    e.preventDefault();
                    cycleCard(stack);
                }
            }
        });

        // Hover pause/play events
        stack.addEventListener('mouseenter', stopAutoCycle);
        stack.addEventListener('mouseleave', startAutoCycle);
        
        // Focus pause/play events (a11y)
        stack.addEventListener('focusin', stopAutoCycle);
        stack.addEventListener('focusout', stopAutoCycle);
    });

    // ==========================================
    // DUAL RADAR LABS / FARM SCREEN CLICK LOGIC
    // ==========================================
    const farmScreen = document.querySelector('.farm-screen');
    const greenRadar = document.querySelector('.green-radar');
    const blipRadar = document.querySelector('.blip-radar');

    function playRadarLockSound() {
        initAudio();
        if (!audioCtx) return;
        const now = audioCtx.currentTime;
        const playSweep = (startFreq, endFreq, time) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(startFreq, time);
            osc.frequency.exponentialRampToValueAtTime(endFreq, time + 0.15);
            gain.gain.setValueAtTime(0.02, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(time);
            osc.stop(time + 0.15);
        };
        playSweep(400, 1200, now);
        playSweep(600, 1800, now + 0.08);
    }

    function playWaterDropSound() {
        initAudio();
        if (!audioCtx) return;
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(1300, now + 0.12);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
    }

    if (farmScreen) {
        farmScreen.addEventListener('click', (e) => {
            playWaterDropSound();
            
            // Pulse the farm screen slightly
            farmScreen.style.transform = 'scale(1.08)';
            setTimeout(() => {
                farmScreen.style.transform = '';
            }, 300);
            
            // Open the first photo in the farming stack
            setTimeout(() => {
                openPhotoViewer('radar-farming-model', e.clientX, e.clientY);
            }, 600);
        });
    }

    function activateBlipRadar(x, y) {
        playRadarLockSound();
        if (blipRadar) {
            blipRadar.style.transform = 'scale(2.2)';
            setTimeout(() => {
                blipRadar.style.transform = '';
            }, 1000);
        }
        setTimeout(() => {
            openPhotoViewer('radar-object-id', x, y);
        }, 800);
    }

    if (greenRadar) {
        greenRadar.addEventListener('click', (e) => {
            // Only trigger if clicking screen itself or the blip
            if (e.target === greenRadar || e.target === blipRadar || e.target.classList.contains('radar-sweep') || e.target.classList.contains('radar-grid')) {
                activateBlipRadar(e.clientX, e.clientY);
            }
        });
    }

    // Run welcome text typewriter animation on load
    setTimeout(() => {
        // Safe play bleep trigger on click
        document.body.addEventListener('click', () => {
            initAudio();
        }, { once: true });
        
        typeWriter(welcomeText);
    }, 500);
});
