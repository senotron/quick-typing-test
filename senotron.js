      const texts = {
        tr: [
          `Bilgisayar teknolojilerinin hızla geliştiği günümüz dünyasında klavye kullanma becerisi artık temel bir yetkinlik haline gelmiştir. Yazılım geliştiricilerden dijital pazarlama uzmanlarına kadar her meslek grubu için etkili ve hızlı yazma yeteneği büyük önem taşımaktadır. Bu eğitim programı kullanıcıların hem İngilizce hem Türkçe metinler üzerinde çalışarak iki dilde de uzmanlık kazanmalarını hedeflemektedir. Gelişmiş algoritmalar sayesinde kullanıcıların zayıf yönleri analiz edilmekte ve kişiye özel antrenman programları oluşturulmaktadır. Özellikle teknik terimler ve karmaşık cümle yapıları üzerinde yoğunlaşan bu sistem gerçek dünya senaryolarını simüle ederek profesyonel kullanıcıların ihtiyaçlarını karşılamaktadır. Düzenli pratik yaparak dakikada 120 kelime hızına ve %99,5 doğruluk oranına ulaşmak mümkündür.`.repeat(
            4
          ),
        ],
        en: [
          `In the rapidly evolving landscape of computer technology keyboard proficiency has become a fundamental competency across all professional domains. From software engineers to digital marketing specialists the ability to type efficiently and accurately is paramount. This comprehensive training program is designed to cultivate expertise in both English and Turkish languages employing sophisticated algorithms to analyze user performance and identify areas for improvement. Through meticulously crafted exercises that simulate real-world scenarios users can expect to achieve typing speeds exceeding 120 words per minute while maintaining exceptional accuracy rates above 99.5%. The system's adaptive learning module continuously adjusts difficulty levels based on user progress ensuring optimal skill development.`.repeat(
            4
          ),
        ],
      };

      const elements = {
        gameText: document.getElementById("game-text"),
        inputArea: document.getElementById("input-area"),
        timer: document.getElementById("timer"),
        accuracy: document.getElementById("accuracy"),
        wpm: document.getElementById("wpm"),
        canvas: document.getElementById("certificate"),
      };

      let currentText = "";
      let startTime;
      let timerInterval;
      let currentCharIndex = 0;
      let currentLang = "en";
      let userName = "";

      document.querySelectorAll(".lang-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          document
            .querySelectorAll(".lang-btn")
            .forEach((b) => b.classList.remove("selected"));
          this.classList.add("selected");
          currentLang = this.dataset.lang;
        });
      });

      function startGame() {
        userName = document.getElementById("username").value;
        if (!userName) {
          alert("Please enter your username!");
          return;
        }
        document.getElementById("startModal").style.display = "none";
        initGame();
      }

      function initGame() {
        currentText =
          texts[currentLang][
            Math.floor(Math.random() * texts[currentLang].length)
          ];
        elements.gameText.innerHTML = currentText
          .split("")
          .map((char, i) => `<span data-index="${i}">${char}</span>`)
          .join("");
        elements.inputArea.value = "";
        elements.inputArea.disabled = false;
        elements.inputArea.focus();
        startTime = Date.now();
        currentCharIndex = 0;
        startTimer();
        updateCurrentChar();
      }

      function startTimer() {
        let time = 60;
        elements.timer.textContent = `${time}s`;
        timerInterval = setInterval(() => {
          time--;
          elements.timer.textContent = `${time}s`;
          if (time <= 0) endGame();
        }, 1000);
      }

      elements.inputArea.addEventListener("input", (e) => {
        const typed = e.target.value;
        currentCharIndex = typed.length;
        updateTextDisplay(typed);
        calculateStats();
        scrollToCurrentChar();
      });

      elements.inputArea.addEventListener("paste", (e) => {
        e.preventDefault();
        document.querySelector(".copy-warning").style.display = "block";
        setTimeout(() => {
          document.querySelector(".copy-warning").style.display = "none";
        }, 2000);
      });

      function updateTextDisplay(typed) {
        const spans = elements.gameText.querySelectorAll("span");
        spans.forEach((span, i) => {
          span.className =
            i < typed.length
              ? typed[i] === currentText[i]
                ? "correct"
                : "incorrect"
              : "";
          if (i === currentCharIndex) span.classList.add("current");
        });
      }

      function scrollToCurrentChar() {
        const currentSpan = elements.gameText.querySelector(
          `[data-index="${currentCharIndex}"]`
        );
        if (currentSpan) {
          currentSpan.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center",
          });
        }
      }

      function calculateStats() {
        const typed = elements.inputArea.value;
        const correct = typed
          .split("")
          .filter((c, i) => c === currentText[i]).length;
        const accuracy = ((correct / typed.length) * 100 || 0).toFixed(1);
        const timeElapsed = (Date.now() - startTime) / 1000;
        const wpm = (correct / 5 / (timeElapsed / 60)).toFixed(1);

        elements.accuracy.textContent = `${accuracy}%`;
        elements.wpm.textContent = wpm;
      }

      function endGame() {
        clearInterval(timerInterval);
        elements.inputArea.disabled = true;
        document.getElementById("certificateDownload").style.display = "block";
        generateCertificate();
      }

      function generateCertificate() {
        let binaryInput =
          "01010011 01000101 01001110 01001111 01010100 01010010 01001111 01001110";
        let binaryArray = binaryInput.split(" ");
        let textOutput = binaryArray
          .map((bin) => String.fromCharCode(parseInt(bin, 2)))
          .join("");

        const canvas = elements.canvas;
        canvas.width = 3840;
        canvas.height = 2160;
        const ctx = canvas.getContext("2d");
        const createBackgroundText = () => {
          ctx.save();
          ctx.globalAlpha = 0.1;
          ctx.font = '900 480px "Playfair Display"';
          ctx.fillStyle = "#666666";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          ctx.fillText(`${textOutput}`, canvas.width / 2, canvas.height / 2);
          ctx.restore();
        };

        const gradient = ctx.createLinearGradient(
          0,
          0,
          canvas.width,
          canvas.height
        );
        gradient.addColorStop(0, "#f8f9fa");
        gradient.addColorStop(1, "#e9ecef");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        createBackgroundText();

        ctx.strokeStyle = "#E9C46A";
        ctx.lineWidth = 30;
        ctx.shadowColor = "rgba(0,0,0,0.3)";
        ctx.shadowBlur = 50;
        ctx.strokeRect(120, 120, canvas.width - 240, canvas.height - 240);

        ctx.textAlign = "center";
        ctx.shadowColor = "rgba(0, 0, 0, 0.15)";
        ctx.shadowBlur = 20;

        ctx.fillStyle = "#264653";
        ctx.font = 'italic 900 144px "Playfair Display"';
        ctx.fillText("TYPING MASTERY CERTIFICATE", canvas.width / 2, 400);

        ctx.font = '900 180px "Inter"';
        ctx.fillStyle = "#2A9D8F";
        ctx.fillText(userName.toUpperCase(), canvas.width / 2, 700);

        const metrics = [
          { label: "Words Per Minute", value: elements.wpm.textContent },
          { label: "Accuracy", value: elements.accuracy.textContent },
          { label: "Date", value: new Date().toLocaleDateString() },
        ];

        metrics.forEach((metric, i) => {
          ctx.font = '600 72px "JetBrains Mono"';
          ctx.fillStyle = "#264653";
          ctx.fillText(
            `${metric.label}:`,
            canvas.width / 2 - 400,
            900 + i * 180
          );
          ctx.font = '900 84px "Inter"';
          ctx.fillStyle = "#2A9D8F";
          ctx.fillText(metric.value, canvas.width / 2 + 400, 900 + i * 180);
        });

        const createSeal = () => {
          ctx.save();

          const sealY = canvas.height - 400;
          ctx.translate(canvas.width / 2, sealY);

          ctx.beginPath();
          for (let i = 0; i < 36; i++) {
            const angle = (i * 10 * Math.PI) / 180;
            const x = Math.cos(angle) * 240;
            const y = Math.sin(angle) * 240;
            ctx.lineTo(x, y);
          }
          ctx.strokeStyle = "#E9C46A";
          ctx.lineWidth = 12;
          ctx.stroke();

          ctx.font = '900 54px "Inter"';
          ctx.fillStyle = "#2A9D8F";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("SENOTRON", 0, -30);
          ctx.fillText("CERTIFIED", 0, 50);

          ctx.restore();
        };
        createSeal();
      }

      function downloadCertificate() {
        const canvas = document.createElement("canvas");
        canvas.width = 3840;
        canvas.height = 2160;
        const tempCtx = canvas.getContext("2d");

        tempCtx.drawImage(elements.canvas, 0, 0);

        const link = document.createElement("a");
        link.download = `${userName}_certificate.png`;
        link.href = canvas.toDataURL("image/png", 1.0);
        link.click();
      }
      function downloadCertificate() {
        const canvas = document.createElement("canvas");
        canvas.width = 2560;
        canvas.height = 1440;
        const tempCtx = canvas.getContext("2d");

        tempCtx.drawImage(elements.canvas, 0, 0);

        tempCtx.globalCompositeOperation = "overlay";
        tempCtx.fillStyle = "rgba(233, 196, 106, 0.03)";
        tempCtx.fillRect(0, 0, canvas.width, canvas.height);

        const link = document.createElement("a");
        link.download = `${userName}_certificate_${Date.now()}.png`;
        link.href = canvas.toDataURL("image/png", 1.0);
        link.click();
      }
      function downloadCertificate() {
        const link = document.createElement("a");
        link.download = `${userName}_typing_certificate.png`;
        link.href = elements.canvas.toDataURL();
        link.click();
      }

      window.onload = () => {
        document.getElementById("startModal").style.display = "flex";
      };
