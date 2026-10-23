/* ============================================
   ASH Agasthiya Sai Varma Therapy Center
   Custom JavaScript
   ============================================ */

(function ($) {
    'use strict';

    // ---- WhatsApp Form Handler ----
    function initAppointmentForms() {
        var forms = document.querySelectorAll('#appointmentForm, form.appointment-form, #contactForm');
        forms.forEach(function (form) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                
                var currentForm = this;
                var nameInput = currentForm.querySelector('#apt-name, input[name="name"], #fname');
                var phoneInput = currentForm.querySelector('#apt-phone, input[name="phone"]');
                var serviceInput = currentForm.querySelector('#apt-service, select[name="service"]');
                var modeInput = currentForm.querySelector('#apt-mode, select[name="mode"]');
                var dateInput = currentForm.querySelector('#apt-date, input[name="date"]');
                var timeInput = currentForm.querySelector('#apt-time, select[name="time"], input[name="time"]');
                var messageInput = currentForm.querySelector('#apt-message, textarea[name="message"], #message');

                var name = nameInput ? nameInput.value.trim() : '';
                var phone = phoneInput ? phoneInput.value.trim() : '';
                var service = serviceInput ? serviceInput.value : '';
                var mode = modeInput ? modeInput.value : '';
                var date = dateInput ? dateInput.value : '';
                var time = timeInput ? timeInput.value : '';
                var message = messageInput ? messageInput.value.trim() : '';

                // Validation
                if (!name) {
                    showFormMessage(currentForm, 'Please enter your name. / உங்கள் பெயரை உள்ளிடவும்.', 'error');
                    return;
                }
                if (!phone) {
                    showFormMessage(currentForm, 'Please enter your phone number. / தொலைபேசி எண்ணை உள்ளிடவும்.', 'error');
                    return;
                }
                if (!/^[\d\s+\-()]{7,15}$/.test(phone)) {
                    showFormMessage(currentForm, 'Please enter a valid phone number. / சரியான தொலைபேசி எண்ணை உள்ளிடவும்.', 'error');
                    return;
                }

                // Build WhatsApp message
                var waMessage = 'Vanakkam,\n\n';
                waMessage += 'I would like to enquire about an appointment at Ash Agasthiya Sai Varma Therapy Center.\n\n';
                waMessage += '*Name:* ' + name + '\n';
                waMessage += '*Phone:* ' + phone + '\n';
                if (service) waMessage += '*Service:* ' + service + '\n';
                if (mode) waMessage += '*Consultation Mode:* ' + mode + '\n';
                if (date) waMessage += '*Preferred Date:* ' + date + '\n';
                if (time) waMessage += '*Preferred Time:* ' + time + '\n';
                if (message) waMessage += '*Message:* ' + message + '\n';
                waMessage += '\nPlease confirm availability and share any additional details. Thank you!';

                var encodedMessage = encodeURIComponent(waMessage);
                var whatsappURL = 'https://wa.me/917304603707?text=' + encodedMessage;

                // Show success message
                showFormMessage(currentForm, 'Connecting to WhatsApp to send your enquiry... / வாட்ஸ்அப்புக்கு இணைக்கப்படுகிறது...', 'success');

                // Open WhatsApp
                setTimeout(function () {
                    window.open(whatsappURL, '_blank');
                }, 600);
            });
        });
    }

    function showFormMessage(form, msg, type) {
        var msgDiv = form.querySelector('#msgSubmit') || document.getElementById('msgSubmit');
        if (msgDiv) {
            msgDiv.textContent = msg;
            msgDiv.className = 'h3 ' + (type === 'success' ? 'text-success' : 'text-danger');
            msgDiv.style.display = 'block';
            msgDiv.style.fontSize = '14px';
            msgDiv.style.marginTop = '12px';
            msgDiv.style.fontWeight = '600';
            
            if (type === 'success') {
                setTimeout(function () {
                    msgDiv.style.display = 'none';
                }, 6000);
            }
        }
    }

    // ---- Language Switcher ----
    var currentLang = localStorage.getItem('ash-lang') || 'en';

    function initLanguageSwitcher() {
        var langBtns = document.querySelectorAll('.lang-btn');
        
        // Set initial active state
        langBtns.forEach(function (btn) {
            if (btn.getAttribute('data-lang') === currentLang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
            
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                var lang = this.getAttribute('data-lang');
                currentLang = lang;
                localStorage.setItem('ash-lang', lang);
                
                // Update active states
                document.querySelectorAll('.lang-btn').forEach(function (b) {
                    if (b.getAttribute('data-lang') === lang) {
                        b.classList.add('active');
                    } else {
                        b.classList.remove('active');
                    }
                });
                
                switchLanguage(lang);
            });
        });

        // Apply saved language on load
        if (currentLang !== 'en') {
            switchLanguage(currentLang);
        }
    }

    function switchLanguage(lang) {
        var elements = document.querySelectorAll('[data-lang-' + lang + ']');
        elements.forEach(function (el) {
            var text = el.getAttribute('data-lang-' + lang);
            if (text) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = text;
                } else if (el.tagName === 'OPTION') {
                    el.textContent = text;
                } else {
                    // Check if element has child HTML elements (like icons or links)
                    var hasChildIcons = el.querySelector('i, img, svg');
                    if (hasChildIcons) {
                        // Update only first text node
                        var nodes = el.childNodes;
                        for (var i = 0; i < nodes.length; i++) {
                            if (nodes[i].nodeType === 3 && nodes[i].textContent.trim().length > 0) {
                                nodes[i].textContent = ' ' + text;
                                break;
                            }
                        }
                    } else {
                        el.textContent = text;
                    }
                }
            }
        });

        // Update html lang attribute
        document.documentElement.lang = lang === 'ta' ? 'ta' : 'en';
    }

    // ---- Lightbox / Magnific Popup initialization ----
    function initPopups() {
        if ($.fn.magnificPopup) {
            $('.popup-gallery').magnificPopup({
                delegate: 'a',
                type: 'image',
                gallery: {
                    enabled: true,
                    navigateByImgClick: true,
                    preload: [0, 1]
                },
                image: {
                    titleSrc: function(item) {
                        return item.el.attr('title') || '';
                    }
                }
            });

            $('.gallery-popup').magnificPopup({
                type: 'image',
                closeOnContentClick: true,
                mainClass: 'mfp-img-mobile',
                image: {
                    verticalFit: true,
                    titleSrc: function(item) {
                        return item.el.attr('title') || '';
                    }
                }
            });
        }
    }

    // ---- Scroll to top button ----
    function initScrollTop() {
        var scrollBtn = document.createElement('button');
        scrollBtn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
        scrollBtn.className = 'ash-scroll-top';
        scrollBtn.setAttribute('aria-label', 'Scroll to top');
        scrollBtn.style.cssText = 'position:fixed;bottom:165px;right:30px;width:48px;height:48px;border-radius:50%;background:var(--ash-deep-green, #174D35);color:#fff;border:none;cursor:pointer;z-index:9997;display:none;align-items:center;justify-content:center;font-size:16px;box-shadow:0 4px 15px rgba(23,77,53,0.3);transition:all 0.3s ease;';
        document.body.appendChild(scrollBtn);

        scrollBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        window.addEventListener('scroll', function () {
            if (window.scrollY > 450) {
                scrollBtn.style.display = 'flex';
            } else {
                scrollBtn.style.display = 'none';
            }
        });
    }

    // ---- Active Navigation Link Sync ----
    function syncActiveNavLinks() {
        var pathname = window.location.pathname || '';
        var filename = pathname.split('/').pop().split('?')[0].split('#')[0];
        if (!filename || filename === '' || filename === 'index.html' || filename === 'index-3.html') {
            filename = 'index.html';
        }

        function checkMatch(href) {
            if (!href) return false;
            var linkFile = href.split('/').pop().split('?')[0].split('#')[0];
            if (filename === 'index.html') {
                return linkFile === '' || linkFile === 'index.html' || linkFile === 'index-3.html' || href === '/';
            }
            return linkFile === filename;
        }

        // Desktop links
        $('#menu > li:not(.highlighted-menu) > a').each(function () {
            var href = $(this).attr('href');
            if (checkMatch(href)) {
                $(this).addClass('active');
                $(this).closest('li').addClass('active');
            } else {
                $(this).removeClass('active');
                $(this).closest('li').removeClass('active');
            }
        });

        // Mobile SlickNav links
        $('.slicknav_nav li:not(.highlighted-menu) a').each(function () {
            var href = $(this).attr('href');
            if (checkMatch(href)) {
                $(this).addClass('active');
                $(this).closest('li').addClass('active');
            } else {
                $(this).removeClass('active');
                $(this).closest('li').removeClass('active');
            }
        });
    }

    // ---- Initialize on DOM Ready ----
    $(document).ready(function () {
        initAppointmentForms();
        initLanguageSwitcher();
        initPopups();
        initScrollTop();
        syncActiveNavLinks();
        setTimeout(syncActiveNavLinks, 150);
        setTimeout(syncActiveNavLinks, 500);
    });

})(jQuery);
