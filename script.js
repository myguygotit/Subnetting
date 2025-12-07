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
            this.initChapter10();
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

        initChapter1() {
            this.bits = [128, 64, 32, 16, 8, 4, 2, 1];
            this.bitState = [true, true, false, false, false, false, false, false]; // Default to 192
            const switchboard = document.getElementById('byteSwitchboard');
            const byteTotalEl = document.getElementById('byteTotal');
            if (!switchboard) return;

            const renderBits = () => {
                switchboard.innerHTML = '';
                this.bits.forEach((val, i) => {
                    const el = document.createElement('div');
                    el.className = `bit-toggle ${this.bitState[i] ? 'on' : ''}`;
                    el.setAttribute('role', 'switch');
                    el.setAttribute('aria-checked', this.bitState[i]);
                    el.innerHTML = `<div class="power">${val}</div><div class="value">${this.bitState[i] ? '1' : '0'}</div>`;
                    el.addEventListener('click', () => {
                        this.bitState[i] = !this.bitState[i];
                        renderBits();
                    });
                    switchboard.appendChild(el);
                });
                updateByteTotal();
            }
            
            const updateByteTotal = () => {
                const total = this.bits.reduce((sum, val, i) => sum + (this.bitState[i] ? val : 0), 0);
                byteTotalEl.textContent = total;
            }

            renderBits();
        }

        initChapter2() {
            const boundaryProblemEl = document.getElementById('boundaryProblem');
            if (!boundaryProblemEl) return;
            const boundaryNetworkInput = document.getElementById('boundaryNetwork');
            const boundaryBroadcastInput = document.getElementById('boundaryBroadcast');
            const boundaryCheckBtn = document.getElementById('boundaryCheckBtn');
            const boundaryFeedbackEl = document.getElementById('boundaryFeedback');
            let currentBoundaryProblem = {};

            const generateBoundaryProblem = () => {
                boundaryFeedbackEl.style.display = 'none';
                boundaryNetworkInput.value = '';
                boundaryBroadcastInput.value = '';

                const cidr = Math.floor(Math.random() * (28 - 25 + 1)) + 25;
                const ip = [192, 168, 1, Math.floor(Math.random()*254)+1];
                
                const networkID = this.getNetworkID(ip, cidr);
                const broadcast = this.getBroadcastAddress(networkID, cidr);
                
                currentBoundaryProblem = {
                    ip: ip.join('.'),
                    cidr,
                    correctNetworkId: networkID.join('.'),
                    correctBroadcastIp: broadcast.join('.'),
                };
                
                boundaryProblemEl.innerHTML = `<strong>${currentBoundaryProblem.ip} /${currentBoundaryProblem.cidr}</strong>`;
            }

            const checkBoundary = () => {
                const userNetworkId = boundaryNetworkInput.value.trim();
                const userBroadcastIp = boundaryBroadcastInput.value.trim();

                if (userNetworkId === currentBoundaryProblem.correctNetworkId && userBroadcastIp === currentBoundaryProblem.correctBroadcastIp) {
                    boundaryFeedbackEl.style.background = 'rgba(0, 255, 136, 0.1)';
                    boundaryFeedbackEl.style.borderColor = 'var(--net-color)';
                    boundaryFeedbackEl.innerHTML = `<strong>Correct!</strong> Well done. New problem generated.`;
                    setTimeout(generateBoundaryProblem, 2000);
                } else {
                    boundaryFeedbackEl.style.background = 'rgba(255, 71, 71, 0.1)';
                    boundaryFeedbackEl.style.borderColor = 'var(--red-color)';
                    let feedback = `<strong>Not quite.</strong> For <strong>${currentBoundaryProblem.ip} /${currentBoundaryProblem.cidr}</strong>:<br>`;
                    feedback += `The correct Network ID was <strong>${currentBoundaryProblem.correctNetworkId}</strong>.<br>`;
                    feedback += `The correct Broadcast IP was <strong>${currentBoundaryProblem.correctBroadcastIp}</strong>.<br>`;
                    boundaryFeedbackEl.innerHTML = feedback;
                }
                boundaryFeedbackEl.style.display = 'block';
            }

            boundaryCheckBtn.addEventListener('click', checkBoundary);
            generateBoundaryProblem();
        }
        
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

        initChapter4() {
            const calcIpInput = document.getElementById('calcIpInput');
            if (!calcIpInput) return;
            const calcCidrInput = document.getElementById('calcCidrInput');
            const calcBtn = document.getElementById('calcBtn');
            const calcLog = document.getElementById('calcLog');
            const calcResults = document.getElementById('calcResults');
            
            const logLine = async (message, isError = false) => {
                const line = document.createElement('div');
                line.className = 'log-line';
                line.innerHTML = message;
                if(isError) line.style.color = 'var(--red-color)';
                calcLog.appendChild(line);
                await this.sleep(50);
                line.classList.add('visible');
            }

            const renderCalcResults = (data) => {
                const results = [
                    { label: 'Network ID', value: data.networkID.join('.'), class: 'net' },
                    { label: 'Broadcast', value: data.broadcast.join('.'), class: 'host' },
                    { label: 'First Usable IP', value: data.firstUsable.join('.'), class: 'host' },
                    { label: 'Last Usable IP', value: data.lastUsable.join('.'), class: 'host' },
                    { label: 'Next Network', value: data.nextNetwork.join('.'), class: 'net' },
                    { label: 'Subnet Mask', value: data.mask.join('.'), class: '' },
                ];
                calcResults.innerHTML = results.map(r => `
                    <div class="result-card">
                        <div class="label">${r.label}</div>
                        <div class="value ${r.class}">${r.value}</div>
                    </div>
                `).join('');
            }

            const runCalculator = async () => {
                calcLog.innerHTML = '';
                calcResults.innerHTML = '';
                
                const ipStr = calcIpInput.value.trim();
                const cidr = parseInt(calcCidrInput.value.replace('/', ''));
                const octets = this.ipToOctets(ipStr);

                if (!octets || isNaN(cidr) || cidr < 0 || cidr > 32) {
                    logLine("Invalid input. Please check IP and CIDR.", true);
                    return;
                }
                
                const mask = this.cidrToMask(cidr);
                const interestingOctetIndex = Math.floor((cidr - 1) / 8);
                const maskOctet = mask[interestingOctetIndex];
                const magicNumber = maskOctet === 255 ? 0 : 256 - maskOctet;

                await logLine(`Step 1: /${cidr} is in the <strong>${interestingOctetIndex + 1}th Octet</strong>.`);
                await this.sleep(500);
                await logLine(`Step 2: Convert /${cidr} to Mask Octet &rarr; <strong>${maskOctet}</strong>.`);
                await this.sleep(500);
                if (magicNumber > 0) {
                  await logLine(`Step 3: Magic Number is 256 - ${maskOctet} = <strong>${magicNumber}</strong>.`);
                  await this.sleep(500);
                }

                const networkStartOctet = magicNumber > 0 ? Math.floor(octets[interestingOctetIndex] / magicNumber) * magicNumber : octets[interestingOctetIndex];
                
                if (magicNumber > 0) {
                  let multiples = [];
                  for (let i = 0; i < 256; i += magicNumber) multiples.push(i);
                  await logLine(`Step 4: Multiples of ${magicNumber} are: ${multiples.slice(0, 5).join(', ')}...`);
                  await this.sleep(500);
                  await logLine(`Step 5: Your IP's octet (${octets[interestingOctetIndex]}) is in the block starting at <strong>${networkStartOctet}</strong>.`);
                }
                
                const networkID = this.getNetworkID(octets, cidr);
                const broadcast = this.getBroadcastAddress(networkID, cidr);
                const firstUsable = this.nextIp(networkID);
                const lastUsable = this.prevIp(broadcast);
                const nextNetwork = this.nextIp(broadcast);
                
                renderCalcResults({ networkID, broadcast, firstUsable, lastUsable, nextNetwork, mask, magicNumber });
            }
            
            calcBtn.addEventListener('click', runCalculator);
        }

        initChapter4_5() {
            const drillProblemEl = document.getElementById('drillProblem');
            if (!drillProblemEl) return;
            const drillNetworkIdInput = document.getElementById('drillNetworkId');
            const drillBroadcastIpInput = document.getElementById('drillBroadcastIp');
            const drillCheckBtn = document.getElementById('drillCheckBtn');
            const drillFeedbackEl = document.getElementById('drillFeedback');
            let currentDrill = {};

            const generateDrillProblem = () => {
                drillFeedbackEl.style.display = 'none';
                drillNetworkIdInput.value = '';
                drillBroadcastIpInput.value = '';

                const cidr = Math.floor(Math.random() * (29 - 22 + 1)) + 22;
                const ip = [172, 16, Math.floor(Math.random()*256), Math.floor(Math.random()*254)+1];
                
                const networkID = this.getNetworkID(ip, cidr);
                const broadcast = this.getBroadcastAddress(networkID, cidr);
                
                currentDrill = {
                    ip: ip.join('.'),
                    cidr,
                    correctNetworkId: networkID.join('.'),
                    correctBroadcastIp: broadcast.join('.'),
                };
                
                drillProblemEl.innerHTML = `<strong>${currentDrill.ip} /${currentDrill.cidr}</strong>`;
            }

            const checkDrill = () => {
                const userNetworkId = drillNetworkIdInput.value.trim();
                const userBroadcastIp = drillBroadcastIpInput.value.trim();

                if (userNetworkId === currentDrill.correctNetworkId && userBroadcastIp === currentDrill.correctBroadcastIp) {
                    drillFeedbackEl.style.background = 'rgba(0, 255, 136, 0.1)';
                    drillFeedbackEl.style.borderColor = 'var(--net-color)';
                    drillFeedbackEl.innerHTML = `<strong>Correct!</strong> Excellent work. Generating new problem...`;
                    setTimeout(generateDrillProblem, 2000);
                } else {
                    drillFeedbackEl.style.background = 'rgba(255, 71, 71, 0.1)';
                    drillFeedbackEl.style.borderColor = 'var(--red-color)';
                    let feedback = `<strong>Incorrect.</strong> Here's the breakdown for <strong>${currentDrill.ip} /${currentDrill.cidr}</strong>:<br>`;
                    feedback += `The correct Network ID was <strong>${currentDrill.correctNetworkId}</strong>.<br>`;
                    feedback += `The correct Broadcast IP was <strong>${currentDrill.correctBroadcastIp}</strong>.<br><br>`;
                    const mask = this.cidrToMask(currentDrill.cidr);
                    const interestingOctetIndex = Math.floor((currentDrill.cidr - 1) / 8);
                    const magicNumber = 256 - mask[interestingOctetIndex];
                    feedback += `<strong>Step 1:</strong> The Magic Number for /${currentDrill.cidr} is <strong>${magicNumber}</strong> (since the mask octet is ${mask[interestingOctetIndex]}).<br>`;
                    feedback += `<strong>Step 2:</strong> The Network ID is the block start. For the IP octet ${currentDrill.ip.split('.')[interestingOctetIndex]}, the block is <strong>${currentDrill.correctNetworkId}</strong>.<br>`;
                    feedback += `<strong>Step 3:</strong> The Broadcast IP is the last address in that block, which is <strong>${currentDrill.correctBroadcastIp}</strong>.`;
                    drillFeedbackEl.innerHTML = feedback;
                }
                drillFeedbackEl.style.display = 'block';
            }

            drillCheckBtn.addEventListener('click', checkDrill);
            generateDrillProblem();
        }

        initChapter5() {
            const vlsmRequirementsEl = document.getElementById('vlsmRequirements');
            const vlsmTableEl = document.getElementById('vlsmTable');
            const vlsmCheckBtn = document.getElementById('vlsmCheckBtn');
            const vlsmFeedbackEl = document.getElementById('vlsmFeedback');
            if(!vlsmRequirementsEl) return;

            let requirements = [];
            let solutions = [];

            const generateVlsmProblem = () => {
                requirements = [
                    { name: 'HQ', hosts: 500 },
                    { name: 'Sales', hosts: 200 },
                    { name: 'Marketing', hosts: 100 },
                    { name: 'WAN Link A', hosts: 2 },
                    { name: 'WAN Link B', hosts: 2 },
                ].sort((a,b) => b.hosts - a.hosts);

                vlsmRequirementsEl.innerHTML = requirements.map(r => `<li><strong>${r.name}:</strong> Requires ${r.hosts} hosts</li>`).join('');

                let tableHtml = `
                    <thead><tr><th>Department</th><th>Required Hosts</th><th>Assigned Network ID</th><th>Assigned CIDR</th></tr></thead>
                    <tbody>`;
                
                let startAddress = this.ipToOctets("10.10.0.0");
                solutions = [];

                requirements.forEach(req => {
                    const neededBits = Math.ceil(Math.log2(req.hosts + 2));
                    const cidr = 32 - neededBits;
                    const networkId = [...startAddress];
                    
                    solutions.push({ name: req.name, network: networkId.join('.'), cidr: `/${cidr}` });

                    tableHtml += `
                        <tr>
                            <td>${req.name}</td>
                            <td>${req.hosts}</td>
                            <td><input type="text" class="vlsm-net" data-name="${req.name}" placeholder="10.10.x.x"></td>
                            <td><input type="text" class="vlsm-cidr" data-name="${req.name}" placeholder="/xx"></td>
                        </tr>
                    `;
                    
                    const blockSize = 2 ** neededBits;
                    startAddress[2] += Math.floor(blockSize / 256);
                    startAddress[3] += blockSize % 256;
                });

                vlsmTableEl.innerHTML = `<table>${tableHtml}</tbody></table>`;
            };

            const checkVlsm = () => {
                let allCorrect = true;
                const userInputs = requirements.map(req => {
                    const netInput = document.querySelector(`.vlsm-net[data-name="${req.name}"]`);
                    const cidrInput = document.querySelector(`.vlsm-cidr[data-name="${req.name}"]`);
                    return { name: req.name, network: netInput.value, cidr: cidrInput.value };
                });

                for(let i = 0; i < solutions.length; i++) {
                    if (solutions[i].network !== userInputs[i].network || solutions[i].cidr !== userInputs[i].cidr) {
                        allCorrect = false;
                        break;
                    }
                }

                if (allCorrect) {
                    vlsmFeedbackEl.style.background = 'rgba(0, 255, 136, 0.1)';
                    vlsmFeedbackEl.style.borderColor = 'var(--net-color)';
                    vlsmFeedbackEl.innerHTML = `<strong>Correct!</strong> Your VLSM allocation is perfectly efficient.`;
                } else {
                    vlsmFeedbackEl.style.background = 'rgba(255, 71, 71, 0.1)';
                    vlsmFeedbackEl.style.borderColor = 'var(--red-color)';
                    vlsmFeedbackEl.innerHTML = `<strong>Incorrect.</strong> Your allocation is not correct or efficient. Remember to start with the largest block first. The correct solution is:<br><pre>${solutions.map(s => `${s.name}: ${s.network}${s.cidr}`).join('\n')}</pre>`;
                }
                vlsmFeedbackEl.style.display = 'block';
            };

            vlsmCheckBtn.addEventListener('click', checkVlsm);
            generateVlsmProblem();
        }

        initChapter6() {
            // Re-using the quiz logic from the old file
            const quizDifficultyEl = document.getElementById('quizDifficulty');
            if(!quizDifficultyEl) return;
            const quizScoreEl = document.getElementById('quizScore');
            const quizQuestionEl = document.getElementById('quizQuestion');
            const quizOptionsEl = document.getElementById('quizOptions');
            const quizFeedbackEl = document.getElementById('quizFeedback');
            let quizScore = 0;
            let currentQuiz = {};
            
            const generateRandomAnswer = (level) => {
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

            const checkQuizAnswer = (selected) => {
                if(selected.toString() === currentQuiz.correctAnswer.toString()) {
                    quizScore++;
                    quizFeedbackEl.style.display = 'block';
                    quizFeedbackEl.style.background = 'rgba(0, 255, 136, 0.1)';
                    quizFeedbackEl.style.borderColor = 'var(--net-color)';
                    quizFeedbackEl.innerHTML = `<strong>Correct!</strong> Well done.`;
                } else {
                    quizScore = 0;
                    const mask = this.cidrToMask(currentQuiz.cidr);
                    const magicNumber = 256 - mask[3];
                    quizFeedbackEl.style.display = 'block';
                    quizFeedbackEl.style.background = 'rgba(255, 71, 71, 0.1)';
                    quizFeedbackEl.style.borderColor = 'var(--red-color)';
                    quizFeedbackEl.innerHTML = `<strong>Incorrect.</strong> The correct answer was <strong>${currentQuiz.correctAnswer}</strong>. <br>Hint: The magic number for /${currentQuiz.cidr} is <strong>${magicNumber}</strong>.`;
                }
                quizScoreEl.textContent = `Score: ${quizScore}`;
                setTimeout(generateQuizQuestion, 2500);
            }
            
            const generateQuizQuestion = () => {
                quizFeedbackEl.style.display = 'none';
                const level = parseInt(quizDifficultyEl.value);
                const ip = [10, Math.floor(Math.random()*256), Math.floor(Math.random()*256), Math.floor(Math.random()*254)+1].join('.');
                const cidr = Math.floor(Math.random() * (30-25+1)) + 25;
                
                currentQuiz = { ip, cidr };
                
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
                currentQuiz.correctAnswer = question.correctAnswer;

                let options = new Set([question.correctAnswer]);
                while(options.size < 4) {
                    options.add(generateRandomAnswer(level));
                }
                
                quizQuestionEl.innerHTML = question.text;
                quizOptionsEl.innerHTML = '';
                [...options].sort(() => Math.random()-0.5).forEach(opt => {
                    const btn = document.createElement('button');
                    btn.className = 'option-btn';
                    btn.textContent = opt;
                    btn.addEventListener('click', () => checkQuizAnswer(opt));
                    quizOptionsEl.appendChild(btn);
                });
            }
            
            quizDifficultyEl.addEventListener('change', generateQuizQuestion);
            generateQuizQuestion();
        }

        initChapter7() {
            const summaryProblemEl = document.getElementById('summaryProblem');
            if (!summaryProblemEl) return;
            const summaryAddressInput = document.getElementById('summaryAddress');
            const summaryCidrInput = document.getElementById('summaryCidr');
            const summaryCheckBtn = document.getElementById('summaryCheckBtn');
            const summaryFeedbackEl = document.getElementById('summaryFeedback');
            let currentSummaryProblem = {};

            const decToBin = (octet) => octet.toString(2).padStart(8, '0');

            const generateSummaryProblem = () => {
                summaryFeedbackEl.style.display = 'none';
                summaryAddressInput.value = '';
                summaryCidrInput.value = '';

                const thirdOctetStart = Math.floor(Math.random() * 60) * 4;
                const networks = [
                    `192.168.${thirdOctetStart}.0`,
                    `192.168.${thirdOctetStart + 1}.0`,
                    `192.168.${thirdOctetStart + 2}.0`,
                    `192.168.${thirdOctetStart + 3}.0`,
                ];

                const binOctets = [
                    decToBin(thirdOctetStart),
                    decToBin(thirdOctetStart + 1),
                    decToBin(thirdOctetStart + 2),
                    decToBin(thirdOctetStart + 3)
                ];

                let commonBits = 0;
                for (let i = 0; i < 8; i++) {
                    const firstBit = binOctets[0][i];
                    if (binOctets.every(b => b[i] === firstBit)) {
                        commonBits++;
                    } else {
                        break;
                    }
                }
                
                const summaryCidr = 16 + commonBits;
                const summaryAddress = `192.168.${thirdOctetStart & (255 << (8 - commonBits))}.0`;
                
                currentSummaryProblem = {
                    networks,
                    correctAddress: summaryAddress,
                    correctCidr: `/${summaryCidr}`,
                };
                
                summaryProblemEl.innerHTML = networks.map(n => `<code>${n}/24</code>`).join('<br>');
            }

            const checkSummary = () => {
                const userAddress = summaryAddressInput.value.trim();
                const userCidr = summaryCidrInput.value.trim();

                if (userAddress === currentSummaryProblem.correctAddress && userCidr === currentSummaryProblem.correctCidr) {
                    summaryFeedbackEl.style.background = 'rgba(0, 255, 136, 0.1)';
                    summaryFeedbackEl.style.borderColor = 'var(--net-color)';
                    summaryFeedbackEl.innerHTML = `<strong>Correct!</strong> The summary <strong>${currentSummaryProblem.correctAddress}${currentSummaryProblem.correctCidr}</strong> correctly covers all listed networks. New problem generated.`;
                    setTimeout(generateSummaryProblem, 3000);
                } else {
                    summaryFeedbackEl.style.background = 'rgba(255, 71, 71, 0.1)';
                    summaryFeedbackEl.style.borderColor = 'var(--red-color)';
                    summaryFeedbackEl.innerHTML = `<strong>Incorrect.</strong> The correct summary route is <strong>${currentSummaryProblem.correctAddress}${currentSummaryProblem.correctCidr}</strong>.`;
                }
                summaryFeedbackEl.style.display = 'block';
            }
            
            summaryCheckBtn.addEventListener('click', checkSummary);
            generateSummaryProblem();
        }

        initChapter8() {
            // Reverse CIDR Challenge
            const reverseCidrQuizQuestionEl = document.getElementById('reverseCidrQuizQuestion');
            if (!reverseCidrQuizQuestionEl) return;
            const reverseCidrQuizOptionsEl = document.getElementById('reverseCidrQuizOptions');
            const reverseCidrQuizFeedbackEl = document.getElementById('reverseCidrQuizFeedback');
            let currentReverseCidrQuiz = {};

            const generateReverseCidrQuizQuestion = () => {
                reverseCidrQuizFeedbackEl.style.display = 'none';
                const cidr = Math.floor(Math.random() * (29 - 23 + 1)) + 23; // /23 to /29
                const networkIpBase = [192, 168, Math.floor(Math.random()*50), 0];
                
                const networkID = this.getNetworkID(networkIpBase, cidr);
                const broadcast = this.getBroadcastAddress(networkID, cidr);
                const correctAnswer = `/${cidr}`;

                currentReverseCidrQuiz = { correctAnswer };

                let options = new Set([correctAnswer]);
                while (options.size < 4) {
                     const randomCidr = Math.floor(Math.random() * (29 - 23 + 1)) + 23;
                     options.add(`/${randomCidr}`);
                }
                
                reverseCidrQuizQuestionEl.innerHTML = `Network ID: <strong>${networkID.join('.')}</strong> <br> Broadcast: <strong>${broadcast.join('.')}</strong> <br> What is the CIDR notation?`;
                reverseCidrQuizOptionsEl.innerHTML = '';
                [...options].sort(() => Math.random() - 0.5).forEach(opt => {
                    const btn = document.createElement('button');
                    btn.className = 'option-btn';
                    btn.textContent = opt;
                    btn.addEventListener('click', () => checkReverseCidrAnswer(opt));
                    reverseCidrQuizOptionsEl.appendChild(btn);
                });
            }

            const checkReverseCidrAnswer = (selected) => {
                 if (selected === currentReverseCidrQuiz.correctAnswer) {
                    reverseCidrQuizFeedbackEl.style.background = 'rgba(0, 255, 136, 0.1)';
                    reverseCidrQuizFeedbackEl.style.borderColor = 'var(--net-color)';
                    reverseCidrQuizFeedbackEl.innerHTML = `<strong>Correct!</strong> You reverse-engineered the CIDR perfectly.`;
                } else {
                    reverseCidrQuizFeedbackEl.style.background = 'rgba(255, 71, 71, 0.1)';
                    reverseCidrQuizFeedbackEl.style.borderColor = 'var(--red-color)';
                    reverseCidrQuizFeedbackEl.innerHTML = `<strong>Not quite.</strong> The correct CIDR was <strong>${currentReverseCidrQuiz.correctAnswer}</strong>. Hint: Count the total IPs in the range to find the host bits.`;
                }
                reverseCidrQuizFeedbackEl.style.display = 'block';
                setTimeout(generateReverseCidrQuizQuestion, 3000);
            }

            generateReverseCidrQuizQuestion();
        }
        
        initChapter9() {
            const aiChatWindow = document.getElementById('aiChatWindow');
            if(!aiChatWindow) return;
            const aiChatInput = document.getElementById('aiChatInput');
            let currentQuiz = {};
            
            const addChatMessage = (text, author) => {
                const messageDiv = document.createElement('div');
                messageDiv.className = `chat-message ${author}`;
                messageDiv.innerHTML = `<div class="author">${author === 'ai' ? 'AI Mentor' : 'You'}</div><div class="text">${text}</div>`;
                aiChatWindow.appendChild(messageDiv);
                aiChatWindow.scrollTop = aiChatWindow.scrollHeight;
            }

            const getAIResponse = (input) => {
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
                    // This needs access to the quiz component's state, which it doesn't have.
                    // This is a limitation of the current design.
                    return "I can't provide hints for active quizzes at the moment, but a new quiz has been generated for you in Chapter 6.";
                }
                if (text.includes("hello") || text.includes("hi")) {
                    return "Hello. How can I assist you with your subnetting training?";
                }
                
                return "I am a specialized AI. My knowledge is focused on subnetting. Try asking me 'what is a network id?', 'explain vlsm', 'how do I calculate subnet?', or tell me to 'create a quiz'.";
            }
            
            const handleUserMessage = () => {
                const userInput = aiChatInput.value.trim();
                if (!userInput) return;
                
                addChatMessage(userInput, "user");
                aiChatInput.value = '';
                
                setTimeout(() => {
                    const aiResponse = getAIResponse(userInput);
                    addChatMessage(aiResponse, "ai");
                }, 800);
            }

            aiChatInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    handleUserMessage();
                }
            });
            addChatMessage("Hello, Recruit. I am the Cyber Mentor AI. Ask me about subnetting concepts, or tell me to 'create a quiz'.", "ai");
        }

        initChapter10() {
            const tableEl = document.getElementById('troubleTable');
            const feedbackEl = document.getElementById('troubleFeedback');
            if(!tableEl) return;

            const network = "192.168.100.0/26";
            const correctNetworkId = "192.168.100.0";
            const correctBroadcastIp = "192.168.100.63";
            
            const devices = [
                { name: "Router", ip: "192.168.100.1", mask: "/26", issue: null },
                { name: "PC-A", ip: "192.168.100.62", mask: "/26", issue: null },
                { name: "PC-B", ip: "192.168.100.63", mask: "/26", issue: "This is the broadcast address and cannot be assigned to a host." },
                { name: "PC-C", ip: "192.168.100.45", mask: "/27", issue: "This device has the wrong subnet mask for this network." },
                { name: "PC-D", ip: "192.168.100.65", mask: "/26", issue: "This IP address is not in the 192.168.100.0/26 subnet." },
            ];

            const generateTroubleScenario = () => {
                let html = `<thead><tr><th>Device</th><th>IP Address</th><th>Subnet Mask</th></tr></thead><tbody>`;
                devices.forEach(d => {
                    html += `<tr class="trouble-row" data-issue="${d.issue || ''}">
                                <td>${d.name}</td>
                                <td>${d.ip}</td>
                                <td>${d.mask}</td>
                             </tr>`;
                });
                tableEl.innerHTML = html;

                document.querySelectorAll('.trouble-row').forEach(row => {
                    row.addEventListener('click', (e) => {
                        const issue = e.currentTarget.dataset.issue;
                        feedbackEl.style.display = 'block';
                        if (issue) {
                            feedbackEl.style.background = 'rgba(0, 255, 136, 0.1)';
                            feedbackEl.style.borderColor = 'var(--net-color)';
                            feedbackEl.innerHTML = `<strong>Correct!</strong> You found an error. <br><strong>Analysis:</strong> ${issue}`;
                        } else {
                            feedbackEl.style.background = 'rgba(255, 71, 71, 0.1)';
                            feedbackEl.style.borderColor = 'var(--red-color)';
                            feedbackEl.innerHTML = `<strong>Incorrect.</strong> This configuration appears to be valid for the ${network} network. Try again.`;
                        }
                    });
                });
            };

            generateTroubleScenario();
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
