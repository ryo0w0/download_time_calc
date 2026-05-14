// 翻訳データ
let translations = {};
let currentLang = getCookie('lang') || 'ja';

// 翻訳データを読み込む
async function loadTranslations() {
    try {
        const [jaData, enData] = await Promise.all([
            fetch('data/ja.json').then(res => res.json()),
            fetch('data/en.json').then(res => res.json())
        ]);
        translations = {
            ja: jaData,
            en: enData
        };
        // 翻訳データ読み込み後に初期化
        updateLanguage(currentLang);
    } catch (error) {
        console.error('翻訳データの読み込みに失敗しました:', error);
    }
}

// ページ読み込み時に翻訳データを読み込む
function initializeApp() {
    function init() {
        loadTranslations().then(() => {
            setupLanguageButtons();
            setupAllEventListeners();
        });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
}

// 全てのイベントリスナーを設定
function setupAllEventListeners() {
    const body = document.body;
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const closeModal = document.getElementById('closeModal');
    const saveSettings = document.getElementById('saveSettings');
    
    if (!settingsBtn || !settingsModal || !closeModal || !saveSettings) {
        console.error('必要なDOM要素が見つかりません');
        return;
    }
    
    // 設定ボタン: デスクトップのみ回転アニメーション（hover が使える環境だけ）
    // モバイルでは hover イベントが信頼性低いため skip
    if (window.matchMedia('(hover: hover)').matches) {
        settingsBtn.addEventListener('mouseenter', startRotation);
        settingsBtn.addEventListener('mouseleave', stopRotation);
    }

    // 設定ボタン: touchend で即時反応させモーダルを開く
    // touchend は click より先に発火するため 300ms 遅延を完全に回避できる
    // preventDefault() でその後の click イベントによる二重発火を防ぐ
    settingsBtn.addEventListener('touchend', (e) => {
        // タッチ移動量が大きい場合はスクロール操作として無視
        const touch = e.changedTouches[0];
        const startTouch = settingsBtn._touchStart;
        if (startTouch) {
            const dx = Math.abs(touch.clientX - startTouch.x);
            const dy = Math.abs(touch.clientY - startTouch.y);
            if (dx > 10 || dy > 10) return; // スクロール判定
        }
        e.preventDefault(); // 後続の click イベントをキャンセル
        settingsModal.classList.add('show');
        updateActiveButtons();
        updateExpandButtonVisibility();
        stopRotation();
    }, { passive: false });

    settingsBtn.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        settingsBtn._touchStart = { x: touch.clientX, y: touch.clientY };
    }, { passive: true });

    // 設定ボタン: click は非タッチデバイス（デスクトップ）向けのフォールバック
    settingsBtn.addEventListener('click', () => {
        settingsModal.classList.add('show');
        updateActiveButtons();
        updateExpandButtonVisibility();
        stopRotation();
    });
    
    // 展開ボタンのクリックイベント
    const expandColorsBtn = document.getElementById('expandColorsBtn');
    const colorOptionsExpandable = document.getElementById('colorOptionsExpandable');
    if (expandColorsBtn && colorOptionsExpandable) {
        expandColorsBtn.addEventListener('click', () => {
            const isExpanded = colorOptionsExpandable.classList.contains('expanded');
            if (isExpanded) {
                colorOptionsExpandable.classList.remove('expanded');
                const expandTextJa = expandColorsBtn.querySelector('.expand-text-ja');
                const expandTextEn = expandColorsBtn.querySelector('.expand-text-en');
                if (currentLang === 'en') {
                    if (expandTextEn) expandTextEn.textContent = translations.en.expandText;
                } else {
                    if (expandTextJa) expandTextJa.textContent = translations.ja.expandText;
                }
            } else {
                colorOptionsExpandable.classList.add('expanded');
                const expandTextJa = expandColorsBtn.querySelector('.expand-text-ja');
                const expandTextEn = expandColorsBtn.querySelector('.expand-text-en');
                if (currentLang === 'en') {
                    if (expandTextEn) expandTextEn.textContent = translations.en.expandTextLess;
                } else {
                    if (expandTextJa) expandTextJa.textContent = translations.ja.expandTextLess;
                }
            }
        });
    }
    
    closeModal.addEventListener('click', () => {
        settingsModal.classList.remove('show');
    });
    
    saveSettings.addEventListener('click', () => {
        settingsModal.classList.remove('show');
    });
    
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.classList.remove('show');
        }
    });
    
    // テーマ変更（即座に適用・保存）
    document.querySelectorAll('.option-btn[data-theme]').forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.getAttribute('data-theme');
            savedTheme = theme;
            body.setAttribute('data-theme', theme);
            setCookie('theme', theme);
            updateActiveButtons();
        });
    });
    
    // アクセントカラー変更（即座に適用・保存）
    document.querySelectorAll('.option-btn[data-color]').forEach(btn => {
        btn.addEventListener('click', () => {
            const color = btn.getAttribute('data-color');
            savedAccent = color;
            body.setAttribute('data-accent', color);
            setCookie('accent', color);
            updateActiveButtons();
        });
    });
    
    // サイズ単位変更（即座に適用・保存）
    document.querySelectorAll('.option-btn[data-size-unit]').forEach(btn => {
        btn.addEventListener('click', () => {
            sizeUnitBase = parseInt(btn.getAttribute('data-size-unit'));
            setCookie('sizeUnitBase', sizeUnitBase);
            updateActiveButtons();
            updateSizeDisplay();
        });
    });
    
    // 履歴機能のトグル
    const historyToggle = document.getElementById('historyToggle');
    if (historyToggle) {
        historyToggle.checked = historyEnabled;
        historyToggle.addEventListener('change', (e) => {
            historyEnabled = e.target.checked;
            setCookie('historyEnabled', historyEnabled);
            updateHistoryDisplay();
        });
    }
    
    // プライバシーリンク表示のトグル
    const privacyLinkToggle = document.getElementById('privacyLinkToggle');
    if (privacyLinkToggle) {
        privacyLinkToggle.checked = privacyLinkEnabled;
        privacyLinkToggle.addEventListener('change', (e) => {
            privacyLinkEnabled = e.target.checked;
            setCookie('privacyLinkEnabled', privacyLinkEnabled);
            updatePrivacyLinkDisplay();
        });
    }
    
    updatePrivacyLinkDisplay();
    
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', () => {
            clearHistory();
        });
    }
    
    const fileSizeInput = document.getElementById('fileSize');
    const sizeUnitSelect = document.getElementById('sizeUnit');
    const sizeDisplay = document.getElementById('sizeDisplay');
    
    if (fileSizeInput && sizeUnitSelect && sizeDisplay) {
        fileSizeInput.addEventListener('input', updateSizeDisplay);
        sizeUnitSelect.addEventListener('change', updateSizeDisplay);
    }
    
    const speedInput = document.getElementById('speed');
    const speedUnitSelect = document.getElementById('speedUnit');
    
    if (fileSizeInput && speedInput && sizeUnitSelect && speedUnitSelect) {
        [fileSizeInput, speedInput, sizeUnitSelect, speedUnitSelect].forEach(element => {
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    handleEnterKey();
                }
            });
        });
    }
    
    const form = document.getElementById('calculatorForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            calculateDownloadTime();
        });
    }
    
    updateJSTTime();
    setInterval(updateJSTTime, 1000);
    
    updateActiveButtons();
    updateExpandButtonVisibility();
    updateHistoryDisplay();
}

// 履歴機能（localStorage を使用）
function getHistory() {
    try {
        const data = localStorage.getItem('calculationHistory');
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('履歴の読み込みに失敗しました:', e);
        return [];
    }
}

function saveHistory(history) {
    try {
        localStorage.setItem('calculationHistory', JSON.stringify(history));
    } catch (e) {
        console.error('履歴の保存に失敗しました:', e);
    }
}

function addToHistory(calculation) {
    if (!historyEnabled) return;
    
    let history = getHistory();
    
    const isDuplicate = history.some(item => 
        item.fileSize === calculation.fileSize &&
        item.sizeUnit === calculation.sizeUnit &&
        item.speed === calculation.speed &&
        item.speedUnit === calculation.speedUnit
    );
    
    if (isDuplicate) {
        history = history.filter(item => 
            !(item.fileSize === calculation.fileSize &&
              item.sizeUnit === calculation.sizeUnit &&
              item.speed === calculation.speed &&
              item.speedUnit === calculation.speedUnit)
        );
    }
    
    history.unshift(calculation);
    
    if (history.length > 5) {
        history = history.slice(0, 5);
    }
    
    saveHistory(history);
    updateHistoryDisplay();
}

function clearHistory() {
    saveHistory([]);
    updateHistoryDisplay();
}

function formatTimeForHistory(totalSeconds) {
    const t = translations[currentLang];
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    if (days > 0) {
        return `${days}${t.day} ${hours}${t.hour} ${minutes}${t.minute}`;
    } else if (hours > 0) {
        return `${hours}${t.hour} ${minutes}${t.minute}`;
    } else if (minutes > 0) {
        return `${minutes}${t.minute} ${seconds}${t.second}`;
    } else {
        return totalSeconds < 1 ? t.lessThan1sec : `${t.about}${seconds}${t.second}`;
    }
}

function deleteHistoryItem(index) {
    let history = getHistory();
    history.splice(index, 1);
    saveHistory(history);
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    const historyBlock = document.getElementById('historyBlock');
    const historyList = document.getElementById('historyList');
    
    if (!historyBlock || !historyList) return;
    
    if (!historyEnabled) {
        historyBlock.style.display = 'none';
        return;
    }
    
    const history = getHistory();
    
    if (history.length === 0) {
        historyBlock.style.display = 'none';
        return;
    }
    
    historyBlock.style.display = 'block';
    historyList.innerHTML = '';
    
    history.forEach((item, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const fileSizeText = `${item.fileSize} ${item.sizeUnit}`;
        const speedText = `${item.speed} ${item.speedUnit}`;
        const timeText = formatTimeForHistory(item.timeInSeconds);
        
        historyItem.innerHTML = `
            <div class="history-item-content">
                <div class="history-item-row">
                    <span class="history-label">${translations[currentLang].labelFileSize}:</span>
                    <span class="history-value">${fileSizeText}</span>
                </div>
                <div class="history-item-row">
                    <span class="history-label">${translations[currentLang].labelSpeed}:</span>
                    <span class="history-value">${speedText}</span>
                </div>
                <div class="history-item-row">
                    <span class="history-label">${translations[currentLang].resultTitle}:</span>
                    <span class="history-value">${timeText}</span>
                </div>
            </div>
            <button class="delete-history-item-btn" onclick="deleteHistoryItem(${index})" aria-label="削除">×</button>
        `;
        
        historyList.appendChild(historyItem);
    });
}

// 言語切り替えボタンの設定
function setupLanguageButtons() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            updateLanguage(lang);
            updateSizeDisplay();
        });
    });
}

function updateLanguage(lang) {
    currentLang = lang;
    
    if (!translations[lang]) {
        console.warn('翻訳データがまだ読み込まれていません:', lang);
        return;
    }
    
    const t = translations[lang];

    document.getElementById('pageTitle').textContent = t.pageTitle;
    document.getElementById('labelFileSize').textContent = t.labelFileSize;
    document.getElementById('labelSpeed').textContent = t.labelSpeed;
    document.getElementById('fileSize').placeholder = t.placeholderSize;
    document.getElementById('speed').placeholder = t.placeholderSpeed;
    document.getElementById('calculateBtn').textContent = t.calculateBtn;
    document.getElementById('resultTitle').textContent = t.resultTitle;
    document.getElementById('settingsTitle').textContent = t.settingsTitle;
    document.getElementById('themeTitle').textContent = t.themeTitle;
    document.getElementById('colorTitle').textContent = t.colorTitle;
    document.getElementById('sizeUnitTitle').textContent = t.sizeUnitTitle;
    document.getElementById('saveBtnText').textContent = t.saveBtn;
    document.getElementById('saveBtnTextEn').textContent = t.saveBtn;
    
    const historyTitle = document.getElementById('historyTitle');
    const historyToggleLabel = document.getElementById('historyToggleLabel');
    const historyToggleDescription = document.getElementById('historyToggleDescription');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    if (historyTitle) historyTitle.textContent = t.historyTitle;
    if (historyToggleLabel) historyToggleLabel.textContent = t.historyToggleLabel;
    if (historyToggleDescription) historyToggleDescription.textContent = t.historyToggleDescription;
    if (clearHistoryBtn) clearHistoryBtn.setAttribute('aria-label', t.clearHistoryLabel);
    
    const privacyLinkToggleLabel = document.getElementById('privacyLinkToggleLabel');
    const privacyLinkToggleDescription = document.getElementById('privacyLinkToggleDescription');
    const privacyLinkFooter = document.getElementById('privacyLinkFooter');
    const privacyLinkSettings = document.getElementById('privacyLinkSettings');
    if (privacyLinkToggleLabel) privacyLinkToggleLabel.textContent = t.privacyLinkToggleTitle;
    if (privacyLinkToggleDescription) privacyLinkToggleDescription.textContent = t.privacyLinkToggleDescription;
    if (privacyLinkFooter) privacyLinkFooter.textContent = t.privacyPolicy;
    if (privacyLinkSettings) privacyLinkSettings.textContent = t.privacyPolicy;
    
    updatePrivacyLinkDisplay();
    
    document.title = t.pageTitle;
    
    const metaDescription = document.getElementById('metaDescription');
    if (metaDescription) {
        if (lang === 'en') {
            metaDescription.setAttribute('content', 'Simple download time calculator. Instantly calculate download time from file size and connection speed.');
        } else {
            metaDescription.setAttribute('content', 'シンプルなダウンロード計算機。ファイルサイズと回線速度で即座にダウンロード時間を計算します。');
        }
    }
    
    const expandTextJa = document.querySelector('.expand-text-ja');
    const expandTextEn = document.querySelector('.expand-text-en');
    if (expandTextJa && expandTextEn) {
        if (lang === 'en') {
            expandTextJa.style.display = 'none';
            expandTextEn.style.display = 'inline';
            const isExpanded = document.getElementById('colorOptionsExpandable')?.classList.contains('expanded');
            expandTextEn.textContent = isExpanded ? t.expandTextLess : t.expandText;
        } else {
            expandTextJa.style.display = 'inline';
            expandTextEn.style.display = 'none';
            const isExpanded = document.getElementById('colorOptionsExpandable')?.classList.contains('expanded');
            expandTextJa.textContent = isExpanded ? t.expandTextLess : t.expandText;
        }
    }

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    if (lang === 'en') {
        document.querySelectorAll('.theme-text-light, .theme-text-dark, .theme-text-gray').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.color-text-blue, .color-text-green, .color-text-purple, .color-text-orange, .color-text-red, .color-text-mono, .color-text-pastel-blue, .color-text-pastel-green, .color-text-pastel-yellow, .color-text-pastel-pink, .color-text-pink').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.theme-text-en, .color-text-en').forEach(el => el.style.display = 'inline');
    } else {
        document.querySelectorAll('.theme-text-light, .theme-text-dark, .theme-text-gray').forEach(el => el.style.display = 'inline');
        document.querySelectorAll('.color-text-blue, .color-text-green, .color-text-purple, .color-text-orange, .color-text-red, .color-text-mono, .color-text-pastel-blue, .color-text-pastel-green, .color-text-pastel-yellow, .color-text-pastel-pink, .color-text-pink').forEach(el => el.style.display = 'inline');
        document.querySelectorAll('.theme-text-en, .color-text-en').forEach(el => el.style.display = 'none');
    }

    setCookie('lang', lang);
    updateHistoryDisplay();
}

// プライバシーリンクの表示を更新
function updatePrivacyLinkDisplay() {
    const privacyLinkFooter = document.getElementById('privacyLinkFooter');
    const privacyLinkInSettings = document.getElementById('privacyLinkInSettings');
    
    if (privacyLinkFooter) {
        privacyLinkFooter.style.display = privacyLinkEnabled ? 'block' : 'none';
    }
    
    if (privacyLinkInSettings) {
        privacyLinkInSettings.style.display = !privacyLinkEnabled ? 'block' : 'none';
    }
}

// アプリを初期化
initializeApp();

// Cookie管理関数
function setCookie(name, value, days = 365) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// 設定ボタンの回転アニメーション制御
let rotationAngle = 0;
let animationId = null;
let isRotating = false;
let startTime = 0;

function startRotation() {
    const settingsBtn = document.getElementById('settingsBtn');
    if (!settingsBtn || isRotating) return;
    isRotating = true;
    startTime = Date.now() - (rotationAngle / 360) * 2000;
    settingsBtn.style.transition = 'none';
    
    function animate() {
        if (!isRotating) return;
        const elapsed = Date.now() - startTime;
        rotationAngle = (elapsed / 2000) * 360;
        settingsBtn.style.transform = `rotate(${rotationAngle}deg)`;
        animationId = requestAnimationFrame(animate);
    }
    animate();
}

function stopRotation() {
    const settingsBtn = document.getElementById('settingsBtn');
    if (!settingsBtn) return;
    isRotating = false;
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    
    rotationAngle = rotationAngle % 360;
    if (rotationAngle < 0) rotationAngle += 360;
    
    const targetAngle = rotationAngle < 180 ? 0 : 360;
    
    settingsBtn.style.transition = 'transform 0.6s ease-out';
    settingsBtn.style.transform = `rotate(${targetAngle}deg)`;
    
    setTimeout(() => {
        rotationAngle = targetAngle;
        settingsBtn.style.transition = 'background-color 0.2s ease, transform 0.6s ease-out';
    }, 600);
}

// 保存されたテーマとカラーを読み込み
let savedTheme = getCookie('theme') || 
                  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
let savedAccent = getCookie('accent') || 'mono';
let sizeUnitBase = parseInt(getCookie('sizeUnitBase')) || 1000;
let historyEnabled = getCookie('historyEnabled') !== 'false';
let privacyLinkEnabled = getCookie('privacyLinkEnabled') !== 'false';

if (document.body) {
    document.body.setAttribute('data-theme', savedTheme);
    document.body.setAttribute('data-accent', savedAccent);
}

// 展開/折りたたみボタンの表示制御
function updateExpandButtonVisibility() {
    const expandable = document.getElementById('colorOptionsExpandable');
    const expandBtn = document.getElementById('expandColorsBtn');
    if (window.innerWidth <= 480) {
        if (expandBtn) expandBtn.style.display = 'block';
        if (expandable) {
            if (!expandable.classList.contains('expanded')) {
                expandable.style.display = 'grid';
            }
        }
    } else {
        if (expandBtn) expandBtn.style.display = 'none';
        if (expandable) {
            expandable.style.display = 'contents';
            expandable.classList.remove('expanded');
        }
    }
}

window.addEventListener('resize', updateExpandButtonVisibility);

// アクティブなボタンを更新
function updateActiveButtons() {
    const body = document.body;
    if (!body) return;
    const currentTheme = body.getAttribute('data-theme');
    const currentAccent = body.getAttribute('data-accent');

    document.querySelectorAll('.option-btn[data-theme]').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-theme') === currentTheme);
    });

    document.querySelectorAll('.option-btn[data-color]').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-color') === currentAccent);
    });

    document.querySelectorAll('.option-btn[data-size-unit]').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.getAttribute('data-size-unit')) === sizeUnitBase);
    });
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!getCookie('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        if (document.body) {
            document.body.setAttribute('data-theme', newTheme);
        }
    }
});

// ファイルサイズの表示更新
function updateSizeDisplay() {
    const fileSizeInput = document.getElementById('fileSize');
    const sizeUnitSelect = document.getElementById('sizeUnit');
    const sizeDisplay = document.getElementById('sizeDisplay');
    
    if (!fileSizeInput || !sizeUnitSelect || !sizeDisplay) return;
    
    const size = parseFloat(fileSizeInput.value);
    const unit = sizeUnitSelect.value;

    if (!size || size <= 0) {
        sizeDisplay.textContent = '';
        return;
    }

    let displays = [];
    const base = sizeUnitBase;

    if (unit === 'TB') {
        const gb = size * base;
        const mb = gb * base;
        displays.push(`= ${gb.toLocaleString('ja-JP', {maximumFractionDigits: 2})} GB`);
        displays.push(`= ${mb.toLocaleString('ja-JP', {maximumFractionDigits: 0})} MB`);
    } else if (unit === 'GB') {
        const tb = size / base;
        const mb = size * base;
        if (tb >= 0.001) {
            displays.push(`= ${tb.toLocaleString('ja-JP', {maximumFractionDigits: 3})} TB`);
        }
        displays.push(`= ${mb.toLocaleString('ja-JP', {maximumFractionDigits: 0})} MB`);
    } else if (unit === 'MB') {
        const gb = size / base;
        const tb = gb / base;
        if (tb >= 0.001) {
            displays.push(`= ${tb.toLocaleString('ja-JP', {maximumFractionDigits: 3})} TB`);
        }
        if (gb >= 0.001) {
            displays.push(`= ${gb.toLocaleString('ja-JP', {maximumFractionDigits: 3})} GB`);
        }
    }

    sizeDisplay.textContent = displays.join(' ');
}

// エンターキー処理関数
function handleEnterKey() {
    const fileSizeInput = document.getElementById('fileSize');
    const speedInput = document.getElementById('speed');
    
    if (!fileSizeInput || !speedInput) return;
    
    const fileSize = parseFloat(fileSizeInput.value);
    const speed = parseFloat(speedInput.value);
    
    if (!fileSize || fileSize <= 0) {
        if (!speed || speed <= 0) {
            alert(translations[currentLang].alertInvalid);
            fileSizeInput.focus();
        } else {
            fileSizeInput.focus();
        }
        return;
    }
    
    if (!speed || speed <= 0) {
        speedInput.focus();
        return;
    }
    
    calculateDownloadTime();
}

// JST時刻の更新
function updateJSTTime() {
    const jstTimeElement = document.getElementById('jstTime');
    if (!jstTimeElement) return;
    const now = new Date();
    const jstTime = new Intl.DateTimeFormat('ja-JP', {
        timeZone: 'Asia/Tokyo',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).format(now);
    jstTimeElement.textContent = `JST ${jstTime}`;
}

function calculateDownloadTime() {
    const fileSizeInput = document.getElementById('fileSize');
    const sizeUnitSelect = document.getElementById('sizeUnit');
    const speedInput = document.getElementById('speed');
    const speedUnitSelect = document.getElementById('speedUnit');
    const result = document.getElementById('result');
    
    if (!fileSizeInput || !sizeUnitSelect || !speedInput || !speedUnitSelect || !result) {
        console.error('必要なDOM要素が見つかりません');
        return;
    }
    
    const fileSize = parseFloat(fileSizeInput.value);
    const sizeUnit = sizeUnitSelect.value;
    const speed = parseFloat(speedInput.value);
    const speedUnit = speedUnitSelect.value;

    if (!fileSize || fileSize <= 0 || !speed || speed <= 0) {
        alert(translations[currentLang].alertInvalid);
        return;
    }

    let fileSizeInMB;
    const base = sizeUnitBase;
    switch (sizeUnit) {
        case 'MB':
            fileSizeInMB = fileSize;
            break;
        case 'GB':
            fileSizeInMB = fileSize * base;
            break;
        case 'TB':
            fileSizeInMB = fileSize * base * base;
            break;
    }

    let speedInMbps;
    switch (speedUnit) {
        case 'Kbps':
            speedInMbps = speed / 1000;
            break;
        case 'Mbps':
            speedInMbps = speed;
            break;
        case 'Gbps':
            speedInMbps = speed * 1000;
            break;
    }

    const speedInMBps = speedInMbps / 8;
    const timeInSeconds = fileSizeInMB / speedInMBps;

    displayResult(timeInSeconds);
    result.classList.add('show');
    
    if (historyEnabled) {
        addToHistory({
            fileSize: fileSize,
            sizeUnit: sizeUnit,
            speed: speed,
            speedUnit: speedUnit,
            timeInSeconds: timeInSeconds
        });
    }
}

function displayResult(totalSeconds) {
    const resultValue = document.getElementById('resultValue');
    const resultDetail = document.getElementById('resultDetail');
    
    if (!resultValue || !resultDetail) {
        console.error('結果表示用のDOM要素が見つかりません');
        return;
    }
    
    const t = translations[currentLang];
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    let mainDisplay = '';
    let detailDisplay = '';

    if (days > 0) {
        mainDisplay = `${days}${t.day} ${hours}${t.hour}`;
        detailDisplay = `${days}${t.day} ${hours}${t.hour} ${minutes}${t.minute} ${seconds}${t.second}`;
    } else if (hours > 0) {
        mainDisplay = `${hours}${t.hour} ${minutes}${t.minute}`;
        detailDisplay = `${hours}${t.hour} ${minutes}${t.minute} ${seconds}${t.second}`;
    } else if (minutes > 0) {
        mainDisplay = `${minutes}${t.minute} ${seconds}${t.second}`;
        detailDisplay = `${t.total}: ${Math.floor(totalSeconds)}${t.second}`;
    } else {
        mainDisplay = `${seconds}${t.second}`;
        detailDisplay = totalSeconds < 1 ? t.lessThan1sec : `${t.about}${seconds}${t.second}`;
    }

    resultValue.textContent = mainDisplay;
    resultDetail.textContent = detailDisplay;
}
