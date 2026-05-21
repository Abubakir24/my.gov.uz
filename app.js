/**
 * My.Gov - Uzbek ID Card Mockup App Logic
 * Manages UI interactions, dynamic date formatting, real-time clock,
 * masking/unmasking phone number, and ID card rotation/details.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // Element Selectors
    // ----------------------------------------------------

    const userPhone = document.getElementById('user-phone');
    const phoneToggle = document.getElementById('phone-toggle');
    const eyeIcon = phoneToggle.querySelector('.eye-icon');
    const eyeSlashIcon = phoneToggle.querySelector('.eye-slash-icon');
    
    const idCardTrigger = document.getElementById('id-card-trigger');
    const documentModal = document.getElementById('document-modal');
    const modalClose = document.getElementById('modal-close');
    const modalIdCard = document.getElementById('modal-id-card');
    
    const btnRotate = document.getElementById('btn-rotate');
    const btnShow = document.getElementById('btn-show');
    const lastUpdateDate = document.getElementById('last-update-date');

    // ----------------------------------------------------
    // State Variables
    // ----------------------------------------------------
    let isPhoneMasked = true;
    let isCardRotated = false;
    let isQrVisible = false;

    // Mock numbers for phone masking toggle
    const maskedPhone = '+998X7T85Hjhj';
    const unmaskedPhone = '+998 97 785 85 85';

    // ----------------------------------------------------


    // ----------------------------------------------------
    // 2. Dynamic Uzbek Date Formatting
    // ----------------------------------------------------
    function updateLastUpdatedDate() {
        const now = new Date();
        const day = now.getDate();
        const year = now.getFullYear();
        
        const uzbekMonths = [
            'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
            'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'
        ];
        
        const currentMonthUz = uzbekMonths[now.getMonth()];
        lastUpdateDate.textContent = `${day} ${currentMonthUz} ${year}`;
    }
    
    updateLastUpdatedDate();

    // ----------------------------------------------------
    // 3. Mask / Unmask Phone Number
    // ----------------------------------------------------
    phoneToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        isPhoneMasked = !isPhoneMasked;

        if (isPhoneMasked) {
            userPhone.textContent = maskedPhone;
            eyeIcon.style.display = 'block';
            eyeSlashIcon.style.display = 'none';
        } else {
            userPhone.textContent = unmaskedPhone;
            eyeIcon.style.display = 'none';
            eyeSlashIcon.style.display = 'block';
        }

        // Add visual tap feedback
        phoneToggle.style.transform = 'scale(0.85)';
        setTimeout(() => {
            phoneToggle.style.transform = '';
        }, 150);
    });

    // ----------------------------------------------------
    // 4. Modal Management
    // ----------------------------------------------------
    function openModal() {
        documentModal.classList.add('open');
        // Reset state on open
        isCardRotated = false;
        isQrVisible = false;
        modalIdCard.classList.remove('rotated');
        
        // Refresh dynamic update date in modal
        updateLastUpdatedDate();
        
        // Remove QR overlay if it exists
        const existingQr = document.getElementById('qr-modal-overlay');
        if (existingQr) existingQr.remove();
        
        // Reset "Ko'rsatish" button label
        updateShowButtonLabel(false);
    }

    function closeModal() {
        documentModal.classList.remove('open');
        
        // Delay resetting rotation until modal closes out of view
        setTimeout(() => {
            modalIdCard.classList.remove('rotated');
            isCardRotated = false;
            isQrVisible = false;
            const existingQr = document.getElementById('qr-modal-overlay');
            if (existingQr) existingQr.remove();
            updateShowButtonLabel(false);
        }, 300);
    }

    idCardTrigger.addEventListener('click', openModal);
    modalClose.addEventListener('click', closeModal);
    
    // Close modal on escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && documentModal.classList.contains('open')) {
            closeModal();
        }
    });

    // ----------------------------------------------------
    // 5. Card Rotation Controls
    // ----------------------------------------------------
    btnRotate.addEventListener('click', () => {
        isCardRotated = !isCardRotated;
        
        if (isCardRotated) {
            modalIdCard.classList.add('rotated');
        } else {
            modalIdCard.classList.remove('rotated');
        }

        // Visual click feedback on button
        btnRotate.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btnRotate.style.transform = '';
        }, 150);
    });

    // ----------------------------------------------------
    // 6. QR Code / Barcode Overlay (Ko'rsatish)
    // ----------------------------------------------------
    btnShow.addEventListener('click', () => {
        isQrVisible = !isQrVisible;

        // Visual click feedback on button
        btnShow.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btnShow.style.transform = '';
        }, 150);

        if (isQrVisible) {
            showQrOverlay();
            updateShowButtonLabel(true);
        } else {
            hideQrOverlay();
            updateShowButtonLabel(false);
        }
    });

    function updateShowButtonLabel(showQr) {
        const label = btnShow.querySelector('.control-label');
        if (showQr) {
            label.textContent = 'Yashirish';
            btnShow.classList.remove('highlight');
        } else {
            label.textContent = 'Ko\'rsatish';
            btnShow.classList.add('highlight');
        }
    }

    function showQrOverlay() {
        // Remove existing if any
        hideQrOverlay();

        // Create overlay container
        const qrOverlay = document.createElement('div');
        qrOverlay.id = 'qr-modal-overlay';
        
        // Custom styling for QR overlay overlaying the rotated card
        qrOverlay.style.position = 'absolute';
        qrOverlay.style.top = '0';
        qrOverlay.style.left = '0';
        qrOverlay.style.width = '100%';
        qrOverlay.style.height = '100%';
        qrOverlay.style.backgroundColor = 'rgba(10, 15, 30, 0.96)';
        qrOverlay.style.display = 'flex';
        qrOverlay.style.flexDirection = 'column';
        qrOverlay.style.alignItems = 'center';
        qrOverlay.style.justifyContent = 'center';
        qrOverlay.style.zIndex = '50';
        qrOverlay.style.opacity = '0';
        qrOverlay.style.transition = 'opacity 0.3s ease';
        qrOverlay.style.padding = '20px';
        qrOverlay.style.borderRadius = '20px';

        // Set layout inside card orientation
        // Note: The card is rotated 90deg, so everything inside this overlay 
        // will automatically be rotated. We align contents so they look upright when rotated!
        qrOverlay.innerHTML = `
            <div style="transform: rotate(0deg); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 15px; color: white;">
                <h3 style="font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #8cbdff; margin-bottom: 5px;">Hujjat Verifikatsiyasi</h3>
                
                <!-- Simulated QR Code Container -->
                <div style="background-color: white; padding: 12px; border-radius: 12px; box-shadow: 0 8px 25px rgba(0,0,0,0.3); position: relative; overflow: hidden; width: 140px; height: 140px; display: flex; align-items: center; justify-content: center;">
                    <!-- SVG QR Code Mock -->
                    <svg viewBox="0 0 100 100" style="width: 100%; height: 100%;">
                        <!-- Corner Anchors -->
                        <rect x="5" y="5" width="25" height="25" fill="#000" />
                        <rect x="9" y="9" width="17" height="17" fill="#fff" />
                        <rect x="13" y="13" width="9" height="9" fill="#000" />
                        
                        <rect x="70" y="5" width="25" height="25" fill="#000" />
                        <rect x="74" y="9" width="17" height="17" fill="#fff" />
                        <rect x="78" y="13" width="9" height="9" fill="#000" />
                        
                        <rect x="5" y="70" width="25" height="25" fill="#000" />
                        <rect x="9" y="74" width="17" height="17" fill="#fff" />
                        <rect x="13" y="78" width="9" height="9" fill="#000" />
                        
                        <!-- Random QR Pixels -->
                        <path d="M40 5h5v10h-5z M50 5h10v5h-10z M45 20h5v10h-5z M60 20h10v5h-10z M35 35h15v5h-15z M55 35h5v5h-5z M70 35h10v10h-10z M15 45h10v5h-10z M30 45h10v5h-10z M50 45h5v5h-5z M60 45h5v10h-5z M5 55h15v5h-15z M25 55h5v10h-5z M40 55h10v5h-10z M70 55h10v5h-10z M30 70h10v5h-10z M45 70h15v5h-15z M65 70h5v15h-5z M35 80h5v10h-5z M50 80h10v5h-10z M75 80h10v5h-10z M15 90h15v5h-15z M45 90h15v5h-15z M75 90h5v5h-5z" fill="#000" />
                    </svg>
                    
                    <!-- Scan line effect -->
                    <div id="scan-line" style="position: absolute; left: 0; top: 0; width: 100%; height: 3px; background: linear-gradient(to right, transparent, var(--accent-blue), transparent); background-color: var(--accent-blue); opacity: 0.8; animation: qrScan 2.5s infinite linear; box-shadow: 0 0 10px var(--accent-blue);"></div>
                </div>

                <!-- Simulated Barcode -->
                <div style="display: flex; flex-direction: column; align-items: center; margin-top: 10px;">
                    <div style="display: flex; height: 30px; gap: 2px; align-items: stretch; background-color: white; padding: 4px 8px; border-radius: 4px;">
                        <span style="width: 2px; background: black;"></span>
                        <span style="width: 4px; background: black;"></span>
                        <span style="width: 1px; background: black;"></span>
                        <span style="width: 3px; background: black;"></span>
                        <span style="width: 1px; background: black;"></span>
                        <span style="width: 4px; background: black;"></span>
                        <span style="width: 2px; background: black;"></span>
                        <span style="width: 1px; background: black;"></span>
                        <span style="width: 3px; background: black;"></span>
                        <span style="width: 1px; background: black;"></span>
                        <span style="width: 2px; background: black;"></span>
                        <span style="width: 4px; background: black;"></span>
                        <span style="width: 1px; background: black;"></span>
                    </div>
                    <span style="font-size: 11px; color: var(--text-secondary); font-family: monospace; margin-top: 4px; letter-spacing: 2px;">AD 4299634</span>
                </div>
            </div>
        `;

        // Inject scan animation keyframes to document header if not present
        if (!document.getElementById('qr-scan-keyframes')) {
            const style = document.createElement('style');
            style.id = 'qr-scan-keyframes';
            style.innerHTML = `
                @keyframes qrScan {
                    0% { top: 0%; }
                    50% { top: 100%; }
                    100% { top: 0%; }
                }
            `;
            document.head.appendChild(style);
        }

        modalIdCard.appendChild(qrOverlay);
        
        // Trigger reflow to animate opacity
        setTimeout(() => {
            qrOverlay.style.opacity = '1';
        }, 10);
    }

    function hideQrOverlay() {
        const qrOverlay = document.getElementById('qr-modal-overlay');
        if (qrOverlay) {
            qrOverlay.style.opacity = '0';
            setTimeout(() => {
                qrOverlay.remove();
            }, 300);
        }
    }
});
