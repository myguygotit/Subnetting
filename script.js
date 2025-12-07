/**
 * RCAF CYBER COMMAND: SUBNETTING MASTERCLASS
 * Author: Gemini Advanced Agent
 * All logic is self-contained in this vanilla JavaScript block.
 */
document.addEventListener('DOMContentLoaded', () => {

    class MasterclassApp {
        constructor() {
            this.initTheme();
            this.initChapter1();
            this.initChapter2();
            this.initChapter3();
            this.initChapter4();
            this.initChapter4_5();
            this.initChapter5();
            this.initChapter6();
            this.initChapter7();
            this.initChapter8();
            this.initChapter9();
            this.initScrollAnimations();
        }

        initTheme() {
            this.themeToggle = document.getElementById('themeToggle');
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
            if (localStorage.getItem('theme') === 'light-theme') {
                document.body.classList.add('light-theme');
            }
        }

        toggleTheme() {
            document.body.classList.toggle('light-theme');
            if (document.body.classList.contains('light-theme')) {
                localStorage.setItem('theme', 'light-theme');
            } else {
                localStorage.removeItem('theme');
            }
        }
        
        // NEW: SCROLL ANIMATION INITIALIZER
        initScrollAnimations() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            document.querySelectorAll('.scroll-animate').forEach(el => {
                observer.observe(el);
            });
        }

        // CHAPTER 1: FUNDAMENTALS
        initChapter1() {
            this.bits = [128, 64, 32, 16, 8, 4, 2, 1];
            this.bitState = [true, true, false, false, false, false, false, false]; // Default to 192
            this.switchboard = document.getElementById('byteSwitchboard');
            this.byteTotalEl = document.getElementById('byteTotal');
            if (!this.switchboard) return;
            this.renderBits();
        }

        renderBits() {
            this.switchboard.innerHTML = '';
            this.bits.forEach((val, i) => {
                const el = document.createElement('div');
                el.className = `bit-toggle ${this.bitState[i] ? 'on' : ''}`;
                el.setAttribute('role', 'switch');
                el.setAttribute('aria-checked', this.bitState[i]);
                el.innerHTML = `<div class="power">${val}</div><div class="value">${this.bitState[i] ? '1' : '0'}</div>`;
                el.addEventListener('click', () => {
                    this.bitState[i] = !this.bitState[i];
                    this.renderBits();
                });
                this.switchboard.appendChild(el);
            });
            this.updateByteTotal();
        }
        
        updateByteTotal() {
            const total = this.bits.reduce((sum, val, i) => sum + (this.bitState[i] ? val : 0), 0);
            this.byteTotalEl.textContent = total;
        }

        // CHAPTER 2: FINDING BOUNDARIES
        initChapter2() {
            this.boundaryProblemEl = document.getElementById('boundaryProblem');
            if (!this.boundaryProblemEl) return;
            this.boundaryNetworkInput = document.getElementById('boundaryNetwork');
            this.boundaryBroadcastInput = document.getElementById('boundaryBroadcast');
            this.boundaryCheckBtn = document.getElementById('boundaryCheckBtn');
            this.boundaryFeedbackEl = document.getElementById('boundaryFeedback');

            this.boundaryCheckBtn.addEventListener('click', () => this.checkBoundary());
            this.generateBoundaryProblem();
        }

        generateBoundaryProblem() {
            this.boundaryFeedbackEl.style.display = 'none';
            this.boundaryNetworkInput.value = '';
            this.boundaryBroadcastInput.value = '';

            const cidr = Math.floor(Math.random() * (28 - 25 + 1)) + 25; // /25 to /28
            const ip = [192, 168, 1, Math.floor(Math.random()*254)+1];
            
            const networkID = this.getNetworkID(ip, cidr);
            const broadcast = this.getBroadcastAddress(networkID, cidr);
            
            this.currentBoundaryProblem = {
                ip: ip.join('.'),
                cidr,
                correctNetworkId: networkID.join('.'),
                correctBroadcastIp: broadcast.join('.'),
            };
            
            this.boundaryProblemEl.innerHTML = `<strong>${this.currentBoundaryProblem.ip} /${this.currentBoundaryProblem.cidr}</strong>`;
        }

        checkBoundary() {
            const userNetworkId = this.boundaryNetworkInput.value.trim();
            const userBroadcastIp = this.boundaryBroadcastInput.value.trim();

            if (userNetworkId === this.currentBoundaryProblem.correctNetworkId && userBroadcastIp === this.currentBoundaryProblem.correctBroadcastIp) {
                this.boundaryFeedbackEl.style.background = 'rgba(0, 255, 136, 0.1)';
                this.boundaryFeedbackEl.style.borderColor = 'var(--net-color)';
                this.boundaryFeedbackEl.innerHTML = `<strong>Correct!</strong> Well done. New problem generated.`;
                setTimeout(() => this.generateBoundaryProblem(), 2000);
            } else {
                this.boundaryFeedbackEl.style.background = 'rgba(255, 71, 71, 0.1)';
                this.boundaryFeedbackEl.style.borderColor = 'var(--red-color)';
                
                let feedback = `<strong>Not quite.</strong> For <strong>${this.currentBoundaryProblem.ip} /${this.currentBoundaryProblem.cidr}</strong>:<br>`;
                feedback += `The correct Network ID was <strong>${this.currentBoundaryProblem.correctNetworkId}</strong>.<br>`;
                feedback += `The correct Broadcast IP was <strong>${this.currentBoundaryProblem.correctBroadcastIp}</strong>.<br>`;

                this.boundaryFeedbackEl.innerHTML = feedback;
            }
            this.boundaryFeedbackEl.style.display = 'block';
        }
        
        // CHAPTER 3: MAGIC NUMBER
        initChapter3() {
            const table = document.getElementById('magicNumberTable');
            if (!table) return;
            let html = `<thead><tr><th>CIDR</th><th>Mask Octet</th><th>Magic Number</th></tr></thead><tbody>`;
            for (let i = 24; i <= 30; i++) {
                const mask = this.cidrToMask(i);
                const magicOctet = mask[3];
                const magicNumber = 256 - magicOctet;
                html += `<tr><td>/${i}</td><td>.${magicOctet}</td><td>${magicNumber}</td></tr>`;
            }
            table.innerHTML = html + `</tbody>`;
        }

        // CHAPTER 4: CALCULATOR
        initChapter4() {
            this.calcIpInput = document.getElementById('calcIpInput');
            if (!this.calcIpInput) return;
            this.calcCidrInput = document.getElementById('calcCidrInput');
            this.calcBtn = document.getElementById('calcBtn');
            this.calcLog = document.getElementById('calcLog');
            this.calcResults = document.getElementById('calcResults');
            
            this.calcBtn.addEventListener('click', () => this.runCalculator());
        }

        async runCalculator() {
            this.calcLog.innerHTML = '';
            this.calcResults.innerHTML = '';
            
            const ipStr = this.calcIpInput.value.trim();
            const cidr = parseInt(this.calcCidrInput.value.replace('/', ''));
            const octets = this.ipToOctets(ipStr);

            if (!octets || isNaN(cidr) || cidr < 0 || cidr > 32) {
                this.logLine("Invalid input. Please check IP and CIDR.", true);
                return;
            }
            
            const mask = this.cidrToMask(cidr);
            const interestingOctetIndex = Math.floor((cidr - 1) / 8);
            const maskOctet = mask[interestingOctetIndex];
            const magicNumber = maskOctet === 255 ? 0 : 256 - maskOctet;


            await this.logLine(`Step 1: /${cidr} is in the <strong>${interestingOctetIndex + 1}th Octet</strong>.`);
            await this.sleep(1000);
            await this.logLine(`Step 2: Convert /${cidr} to Mask Octet &rarr; <strong>${maskOctet}</strong>.`);
            await this.sleep(1000);
            if (magicNumber > 0) {
              await this.logLine(`Step 3: Magic Number is 256 - ${maskOctet} = <strong>${magicNumber}</strong>.`);
              await this.sleep(1000);
            }

            const networkStartOctet = magicNumber > 0 ? Math.floor(octets[interestingOctetIndex] / magicNumber) * magicNumber : octets[interestingOctetIndex];
            
            if (magicNumber > 0) {
              let multiples = [];
              for (let i = 0; i < 256; i += magicNumber) multiples.push(i);
              await this.logLine(`Step 4: Multiples of ${magicNumber} are: ${multiples.slice(0, 5).join(', ')}...`);
              await this.sleep(1000);
              await this.logLine(`Step 5: Your IP's octet (${octets[interestingOctetIndex]}) is in the block starting at <strong>${networkStartOctet}</strong>.`);
            }
            
            const networkID = this.getNetworkID(octets, cidr);
            const broadcast = this.getBroadcastAddress(networkID, cidr);
            const firstUsable = this.nextIp(networkID);
            const lastUsable = this.prevIp(broadcast);
            const nextNetwork = this.nextIp(broadcast);
            
            this.renderCalcResults({ networkID, broadcast, firstUsable, lastUsable, nextNetwork, mask, magicNumber });
        }
        
        async logLine(message, isError = false) {
            const line = document.createElement('div');
            line.className = 'log-line';
            line.innerHTML = message;
            if(isError) line.style.color = 'var(--red-color)';
            this.calcLog.appendChild(line);
            await this.sleep(50);
            line.classList.add('visible');
        }

        renderCalcResults(data) {
            const results = [
                { label: 'Network ID', value: data.networkID.join('.'), class: 'net' },
                { label: 'Broadcast', value: data.broadcast.join('.'), class: 'host' },
                { label: 'First Usable IP', value: data.firstUsable.join('.'), class: 'host' },
                { label: 'Last Usable IP', value: data.lastUsable.join('.'), class: 'host' },
                { label: 'Next Network', value: data.nextNetwork.join('.'), class: 'net' },
                { label: 'Subnet Mask', value: data.mask.join('.'), class: '' },
            ];
            this.calcResults.innerHTML = results.map(r => `
                <div class="result-card">
                    <div class="label">${r.label}</div>
                    <div class="value ${r.class}">${r.value}</div>
                </div>
            `).join('');
        }

        // CHAPTER 4.5: IP WORKOUT
        initChapter4_5() {
            this.drillProblemEl = document.getElementById('drillProblem');
            if (!this.drillProblemEl) return;
            this.drillNetworkIdInput = document.getElementById('drillNetworkId');
            this.drillBroadcastIpInput = document.getElementById('drillBroadcastIp');
            this.drillCheckBtn = document.getElementById('drillCheckBtn');
            this.drillFeedbackEl = document.getElementById('drillFeedback');

            this.drillCheckBtn.addEventListener('click', () => this.checkDrill());
            this.generateDrillProblem();
        }

        generateDrillProblem() {
            this.drillFeedbackEl.style.display = 'none';
            this.drillNetworkIdInput.value = '';
            this.drillBroadcastIpInput.value = '';

            const cidr = Math.floor(Math.random() * (29 - 22 + 1)) + 22; // /22 to /29
            const ip = [172, 16, Math.floor(Math.random()*256), Math.floor(Math.random()*254)+1];
            
            const networkID = this.getNetworkID(ip, cidr);
            const broadcast = this.getBroadcastAddress(networkID, cidr);
            
            this.currentDrill = {
                ip: ip.join('.'),
                cidr,
                correctNetworkId: networkID.join('.'),
                correctBroadcastIp: broadcast.join('.'),
            };
            
            this.drillProblemEl.innerHTML = `<strong>${this.currentDrill.ip} /${this.currentDrill.cidr}</strong>`;
        }

        checkDrill() {
            const userNetworkId = this.drillNetworkIdInput.value.trim();
            const userBroadcastIp = this.drillBroadcastIpInput.value.trim();

            if (userNetworkId === this.currentDrill.correctNetworkId && userBroadcastIp === this.currentDrill.correctBroadcastIp) {
                this.drillFeedbackEl.style.background = 'rgba(0, 255, 136, 0.1)';
                this.drillFeedbackEl.style.borderColor = 'var(--net-color)';
                this.drillFeedbackEl.innerHTML = `<strong>Correct!</strong> Excellent work. Generating new problem...`;
                setTimeout(() => this.generateDrillProblem(), 2000);
            } else {
                this.drillFeedbackEl.style.background = 'rgba(255, 71, 71, 0.1)';
                this.drillFeedbackEl.style.borderColor = 'var(--red-color)';
                
                let feedback = `<strong>Incorrect.</strong> Here's the breakdown for <strong>${this.currentDrill.ip} /${this.currentDrill.cidr}</strong>:<br>`;
                feedback += `The correct Network ID was <strong>${this.currentDrill.correctNetworkId}</strong>.<br>`;
                feedback += `The correct Broadcast IP was <strong>${this.currentDrill.correctBroadcastIp}</strong>.<br><br>`;

                const mask = this.cidrToMask(this.currentDrill.cidr);
                const interestingOctetIndex = Math.floor((this.currentDrill.cidr - 1) / 8);
                const magicNumber = 256 - mask[interestingOctetIndex];

                feedback += `<strong>Step 1:</strong> The Magic Number for /${this.currentDrill.cidr} is <strong>${magicNumber}</strong> (since the mask octet is ${mask[interestingOctetIndex]}).<br>`;
                feedback += `<strong>Step 2:</strong> The Network ID is the block start. For the IP octet ${this.currentDrill.ip.split('.')[interestingOctetIndex]}, the block is <strong>${this.currentDrill.correctNetworkId}</strong>.<br>`;
                feedback += `<strong>Step 3:</strong> The Broadcast IP is the last address in that block, which is <strong>${this.currentDrill.correctBroadcastIp}</strong>.`;

                this.drillFeedbackEl.innerHTML = feedback;
            }
            this.drillFeedbackEl.style.display = 'block';
        }

        // CHAPTER 5: VLSM
        initChapter5() {
          // No interactive elements in this chapter
        }

        // CHAPTER 6: THE GAUNTLET (QUIZ)
        initChapter6() {
            this.quizDifficultyEl = document.getElementById('quizDifficulty');
            if(!this.quizDifficultyEl) return;
            this.quizScoreEl = document.getElementById('quizScore');
            this.quizQuestionEl = document.getElementById('quizQuestion');
            this.quizOptionsEl = document.getElementById('quizOptions');
            this.quizFeedbackEl = document.getElementById('quizFeedback');
            
            this.quizScore = 0;
            this.quizDifficultyEl.addEventListener('change', () => this.generateQuizQuestion());
            this.generateQuizQuestion();
        }
        
        generateQuizQuestion() {
            this.quizFeedbackEl.style.display = 'none';
            const level = parseInt(this.quizDifficultyEl.value);
            const ip = [10, Math.floor(Math.random()*256), Math.floor(Math.random()*256), Math.floor(Math.random()*254)+1].join('.');
            const cidr = Math.floor(Math.random() * (30-25+1)) + 25;
            
            this.currentQuiz = { ip, cidr };
            
            let question = {};
            
            switch(level) {
                case 1:
                    question.text = `What is the mask octet for <strong>/${cidr}</strong>?`;
                    question.correctAnswer = this.cidrToMask(cidr)[3];
                    break;
                case 2:
                    question.text = `Find the Network ID for <strong>${ip}/${cidr}</strong>.`;
                    question.correctAnswer = this.getNetworkID(this.ipToOctets(ip), cidr).join('.');
                    break;
                case 3: default:
                    const broadcast = this.getBroadcastAddress(this.getNetworkID(this.ipToOctets(ip), cidr), cidr);
                    question.text = `Find the Last Usable IP for <strong>${ip}/${cidr}</strong>.`;
                    question.correctAnswer = this.prevIp(broadcast).join('.');
                    break;
            }
            
            this.currentQuiz.correctAnswer = question.correctAnswer;

            let options = new Set([question.correctAnswer]);
            while(options.size < 4) {
                options.add(this.generateRandomAnswer(level));
            }
            
            this.quizQuestionEl.innerHTML = question.text;
            this.quizOptionsEl.innerHTML = '';
            [...options].sort(() => Math.random()-0.5).forEach(opt => {
                const btn = document.createElement('button');
                btn.className = 'option-btn';
                btn.textContent = opt;
                btn.addEventListener('click', () => this.checkQuizAnswer(opt));
                this.quizOptionsEl.appendChild(btn);
            });
        }
        
        generateRandomAnswer(level) {
            const randIp = [10, Math.floor(Math.random()*256), Math.floor(Math.random()*256), Math.floor(Math.random()*254)+1].join('.');
            const randCidr = Math.floor(Math.random() * (30-25+1)) + 25;
            
            switch(level) {
                case 1: return [128, 192, 224, 240, 248, 252][Math.floor(Math.random()*6)];
                case 2: return this.getNetworkID(this.ipToOctets(randIp), randCidr).join('.');
                case 3: default:
                    const randNet = this.getNetworkID(this.ipToOctets(randIp), randCidr);
                    return this.prevIp(this.getBroadcastAddress(randNet, randCidr)).join('.');
            }
        }
        
        checkQuizAnswer(selected) {
            if(selected === this.currentQuiz.correctAnswer) {
                this.quizScore++;
                this.quizFeedbackEl.style.display = 'block';
                this.quizFeedbackEl.style.background = 'rgba(0, 255, 136, 0.1)';
                this.quizFeedbackEl.style.borderColor = 'var(--net-color)';
                this.quizFeedbackEl.innerHTML = `<strong>Correct!</strong> Well done.`;
            } else {
                this.quizScore = 0;
                const mask = this.cidrToMask(this.currentQuiz.cidr);
                const magicNumber = 256 - mask[3];
                this.quizFeedbackEl.style.display = 'block';
                this.quizFeedbackEl.style.background = 'rgba(255, 71, 71, 0.1)';
                this.quizFeedbackEl.style.borderColor = 'var(--red-color)';
                this.quizFeedbackEl.innerHTML = `<strong>Incorrect.</strong> The correct answer was <strong>${this.currentQuiz.correctAnswer}</strong>. <br>Hint: The magic number for /${this.currentQuiz.cidr} is <strong>${magicNumber}</strong>.`;
            }
            this.quizScoreEl.textContent = `Score: ${this.quizScore}`;
            setTimeout(() => this.generateQuizQuestion(), 2500);
        }

        // CHAPTER 7: WILDCARD DRILL
        initChapter7() {
            this.wildcardQuizQuestionEl = document.getElementById('wildcardQuizQuestion');
            if (!this.wildcardQuizQuestionEl) return;
            this.wildcardQuizOptionsEl = document.getElementById('wildcardQuizOptions');
            this.wildcardQuizFeedbackEl = document.getElementById('wildcardQuizFeedback');
            this.generateWildcardQuizQuestion();
        }

        generateWildcardQuizQuestion() {
            this.wildcardQuizFeedbackEl.style.display = 'none';
            const cidr = Math.floor(Math.random() * (30 - 20 + 1)) + 20; // /20 to /30
            const correctAnswer = this.cidrToWildcard(cidr).join('.');

            this.currentWildcardQuiz = { cidr, correctAnswer };

            let options = new Set([correctAnswer]);
            while (options.size < 4) {
                const randomCidr = Math.floor(Math.random() * (30 - 20 + 1)) + 20;
                options.add(this.cidrToWildcard(randomCidr).join('.'));
            }

            this.wildcardQuizQuestionEl.innerHTML = `What is the <strong>wildcard mask</strong> for a /${cidr} subnet?`;
            this.wildcardQuizOptionsEl.innerHTML = '';
            [...options].sort(() => Math.random() - 0.5).forEach(opt => {
                const btn = document.createElement('button');
                btn.className = 'option-btn';
                btn.textContent = opt;
                btn.addEventListener('click', () => this.checkWildcardAnswer(opt));
                this.wildcardQuizOptionsEl.appendChild(btn);
            });
        }

        checkWildcardAnswer(selected) {
            if (selected === this.currentWildcardQuiz.correctAnswer) {
                this.wildcardQuizFeedbackEl.style.background = 'rgba(0, 255, 136, 0.1)';
                this.wildcardQuizFeedbackEl.style.borderColor = 'var(--net-color)';
                this.wildcardQuizFeedbackEl.innerHTML = `<strong>Correct!</strong> The wildcard for /${this.currentWildcardQuiz.cidr} is indeed ${this.currentWildcardQuiz.correctAnswer}.`;
            } else {
                this.wildcardQuizFeedbackEl.style.background = 'rgba(255, 71, 71, 0.1)';
                this.wildcardQuizFeedbackEl.style.borderColor = 'var(--red-color)';
                this.wildcardQuizFeedbackEl.innerHTML = `<strong>Incorrect.</strong> The correct answer was <strong>${this.currentWildcardQuiz.correctAnswer}</strong>. Remember, wildcard = 255.255.255.255 - subnet mask.`;
            }
            this.wildcardQuizFeedbackEl.style.display = 'block';
            setTimeout(() => this.generateWildcardQuizQuestion(), 3000);
        }

        // CHAPTER 8: REVERSE CIDR CHALLENGE
        initChapter8() {
            this.reverseCidrQuizQuestionEl = document.getElementById('reverseCidrQuizQuestion');
            if (!this.reverseCidrQuizQuestionEl) return;
            this.reverseCidrQuizOptionsEl = document.getElementById('reverseCidrQuizOptions');
            this.reverseCidrQuizFeedbackEl = document.getElementById('reverseCidrQuizFeedback');
            this.generateReverseCidrQuizQuestion();
        }

        generateReverseCidrQuizQuestion() {
            this.reverseCidrQuizFeedbackEl.style.display = 'none';
            const cidr = Math.floor(Math.random() * (29 - 23 + 1)) + 23; // /23 to /29
            const networkIpBase = [192, 168, Math.floor(Math.random()*50), 0];
            
            const networkID = this.getNetworkID(networkIpBase, cidr);
            const broadcast = this.getBroadcastAddress(networkID, cidr);
            const correctAnswer = `/${cidr}`;

            this.currentReverseCidrQuiz = { correctAnswer };

            let options = new Set([correctAnswer]);
            while (options.size < 4) {
                 const randomCidr = Math.floor(Math.random() * (29 - 23 + 1)) + 23;
                 options.add(`/${randomCidr}`);
            }
            
            this.reverseCidrQuizQuestionEl.innerHTML = `Network ID: <strong>${networkID.join('.')}</strong> <br> Broadcast: <strong>${broadcast.join('.')}</strong> <br> What is the CIDR notation?`;
            this.reverseCidrQuizOptionsEl.innerHTML = '';
            [...options].sort(() => Math.random() - 0.5).forEach(opt => {
                const btn = document.createElement('button');
                btn.className = 'option-btn';
                btn.textContent = opt;
                btn.addEventListener('click', () => this.checkReverseCidrAnswer(opt));
                this.reverseCidrQuizOptionsEl.appendChild(btn);
            });
        }

        checkReverseCidrAnswer(selected) {
             if (selected === this.currentReverseCidrQuiz.correctAnswer) {
                this.reverseCidrQuizFeedbackEl.style.background = 'rgba(0, 255, 136, 0.1)';
                this.reverseCidrQuizFeedbackEl.style.borderColor = 'var(--net-color)';
                this.reverseCidrQuizFeedbackEl.innerHTML = `<strong>Correct!</strong> You reverse-engineered the CIDR perfectly.`;
            } else {
                this.reverseCidrQuizFeedbackEl.style.background = 'rgba(255, 71, 71, 0.1)';
                this.reverseCidrQuizFeedbackEl.style.borderColor = 'var(--red-color)';
                this.reverseCidrQuizFeedbackEl.innerHTML = `<strong>Not quite.</strong> The correct CIDR was <strong>${this.currentReverseCidrQuiz.correctAnswer}</strong>. Hint: Count the total IPs in the range to find the host bits.`;
            }
            this.reverseCidrQuizFeedbackEl.style.display = 'block';
            setTimeout(() => this.generateReverseCidrQuizQuestion(), 3000);
        }
        
        // CHAPTER 9: AI MENTOR
        initChapter9() {
            this.aiChatWindow = document.getElementById('aiChatWindow');
            if(!this.aiChatWindow) return;
            this.aiChatInput = document.getElementById('aiChatInput');
            
            this.aiChatInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.handleUserMessage();
                }
            });
            this.addChatMessage("Hello, Recruit. I am the Cyber Mentor AI. Ask me about subnetting concepts, or tell me to 'create a quiz'.", "ai");
        }
        
        handleUserMessage() {
            const userInput = this.aiChatInput.value.trim();
            if (!userInput) return;
            
            this.addChatMessage(userInput, "user");
            this.aiChatInput.value = '';
            
            setTimeout(() => {
                const aiResponse = this.getAIResponse(userInput);
                this.addChatMessage(aiResponse, "ai");
            }, 800);
        }
        
        addChatMessage(text, author) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `chat-message ${author}`;
            messageDiv.innerHTML = `<div class="author">${author === 'ai' ? 'AI Mentor' : 'You'}</div><div class="text">${text}</div>`;
            this.aiChatWindow.appendChild(messageDiv);
            this.aiChatWindow.scrollTop = this.aiChatWindow.scrollHeight;
        }

        getAIResponse(input) {
            const text = input.toLowerCase();
            const quizKeywords = ["create quiz", "new question", "quiz me", "quiz"];

            if (text.includes("what are you") || text.includes("who are you")) {
                return "I am the AI Cyber Mentor for this training module. My purpose is to help you master subnetting by providing definitions and generating practice questions.";
            }
            if (text.includes("start") || text.includes("begin") || text.includes("basics")) {
                const chapter1 = document.getElementById('chapter-1');
                if (chapter1) {
                    chapter1.open = true;
                    chapter1.scrollIntoView({ behavior: 'smooth' });
                }
                return "Of course. The best place to start is <strong>Chapter 1: The Fundamentals</strong>. It explains what an IP address is and how binary numbers work. I've opened it for you.";
            }
            if (text.includes("calculate") || text.includes("how to") || text.includes("steps")) {
                return "The fastest way to calculate a subnet is using the <strong>Magic Number method</strong>: <br>1. Find the 'interesting' mask octet (the one that isn't 255). <br>2. Calculate the Magic Number: <code>256 - [mask octet]</code>. This is your block size. <br>3. Find the network block your IP fits into by finding the multiple of the Magic Number that is less than or equal to your IP's octet. <br>For a detailed, animated example, see <strong>Chapter 4: The Ultimate Calculator</strong>.";
            }
            if (text.includes("cidr")) {
                return "<strong>CIDR (Classless Inter-Domain Routing)</strong> is the modern way to define the size of a network. The number (e.g., /24) represents how many bits of the IP address are for the <strong style='color: var(--net-color)'>network portion</strong>. A higher number means more network bits and fewer host bits.";
            }
            if (quizKeywords.some(kw => text.includes(kw))) {
                const chapter6 = document.getElementById('chapter-6');
                if (chapter6) {
                    chapter6.open = true;
                    chapter6.scrollIntoView({ behavior: 'smooth' });
                }
                this.generateQuizQuestion();
                return "Understood. I have generated a new question for you in <strong>Chapter 6: The Gauntlet</strong>.";
            }
            if (text.includes("network id")) {
                return "The <strong>Network ID</strong> is the very first address in a subnet. It represents the entire network and cannot be assigned to a single device.";
            }
            if (text.includes("broadcast")) {
                return "The <strong>Broadcast Address</strong> is the very last address in a subnet. Sending data to this address sends it to every device on that specific subnet.";
            }
            if (text.includes("magic number")) {
                return "The <strong>Magic Number</strong> (or Block Size) is the key to fast subnetting. You calculate it with <code>256 - [the interesting mask octet]</code>. It tells you the total number of IPs in the subnet and where each new subnet begins (e.g., 0, 32, 64...).";
            }
            if (text.includes("vlsm")) {
                return "<strong>VLSM</strong> stands for Variable Length Subnet Masking. It's a technique to create subnets of different sizes from a larger address block. This is very efficient because you can create a small subnet for a link that only needs 2 IPs, and a larger subnet for a department that needs 50 IPs, all from the same main block.";
            }
            if (text.includes("hint") || text.includes("help")) {
                if (this.currentQuiz) {
                    const mask = this.cidrToMask(this.currentQuiz.cidr);
                    const magicNumber = 256 - mask[3];
                    return `Here's a hint for the current quiz question: The CIDR is /${this.currentQuiz.cidr}. The magic number is <strong>${magicNumber}</strong>. Use that to calculate the answer.`;
                }
                return "I can only provide hints for an active quiz. A new quiz has been generated for you in Chapter 6.";
            }
            if (text.includes("hello") || text.includes("hi")) {
                return "Hello. How can I assist you with your subnetting training?";
            }
            
            return "I am a specialized AI. My knowledge is focused on subnetting. Try asking me 'what is a network id?', 'explain vlsm', 'how do I calculate subnet?', or tell me to 'create a quiz'.";
        }


        // UTILITY METHODS
        sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
        ipToOctets(ip) {
            const parts = ip.trim().split('.');
            if (parts.length !== 4) return null;
            const octets = parts.map(p => parseInt(p, 10));
            return octets.some(o => isNaN(o) || o < 0 || o > 255) ? null : octets;
        }
        cidrToMask(cidr) {
            const mask = [0, 0, 0, 0];
            for (let i = 0; i < cidr; i++) mask[Math.floor(i / 8)] |= 1 << (7 - (i % 8));
            return mask;
        }
        cidrToWildcard(cidr) {
            const mask = this.cidrToMask(cidr);
            return mask.map(octet => 255 - octet);
        }
        getNetworkID(octets, cidr) {
            const mask = this.cidrToMask(cidr);
            return octets.map((octet, i) => octet & mask[i]);
        }
        getBroadcastAddress(networkID, cidr) {
            const broadcast = [...networkID];
            for (let i = 31; i >= cidr; i--) {
                broadcast[Math.floor(i / 8)] |= 1 << (7 - (i % 8));
            }
            return broadcast;
        }
        nextIp(octets) {
            const newOctets = [...octets];
            for (let i = 3; i >= 0; i--) {
                if (newOctets[i] < 255) { newOctets[i]++; break; }
                newOctets[i] = 0;
            }
            return newOctets;
        }
        prevIp(octets) {
            const newOctets = [...octets];
            for (let i = 3; i >= 0; i--) {
                if (newOctets[i] > 0) { newOctets[i]--; break; }
                newOctets[i] = 255;
            }
            return newOctets;
        }
    }

    new MasterclassApp();
});
</script>
