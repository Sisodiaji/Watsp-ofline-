(async () => {

  try {

    const { makeWASocket, useMultiFileAuthState, delay, DisconnectReason } = await import("@whiskeysockets/baileys");

    const fs = await import('fs');

    const pino = (await import('pino')).default;

    const rl = (await import("readline")).createInterface({ input: process.stdin, output: process.stdout });

    

    const question = (text) => new Promise((resolve) => rl.question(text, resolve));



    const reset = "\x1b[0m"; 

    const green = "\x1b[1;32m"; 

    const yellow = "\x1b[1;33m"; 



    const logo = `${green}

 __    __ _           _                         

/ /\\ /\\ \\ |__   __ _| |_ ___  __ _ _ __  _ __  

\\ \\/  \\/ / '_ \\ / _\` | __/ __|/ _\` | '_ \\| '_ \\ 

 \\  /\\  /| | | | (_| | |\\__ \\ (_| | |_) | |_) |

  \\/  \\/ |_| |_|\\__,_|\\__|___/\\__,_| .__/| .__/ 

                                   |_|   |_|    

===========================================

[~] Author  : ANISH HERW

[~] GitHub  : ANISH HERW

[~] Tool  :  Anish Automatic WhatsApp Message Sender

============================================`;



    const clearScreen = () => {

      console.clear();

      console.log(logo);

    };



    let targetNumbers = [];

    let groupUIDs = [];

    let messages = null;

    let intervalTime = null;

    let haterName = null;

    let lastSentIndex = 0;



    const { state, saveCreds } = await useMultiFileAuthState('./auth_info');



    async function sendMessages(MznKing) {

      while (true) {

        for (let i = lastSentIndex; i < messages.length; i++) {

          try {

            const currentTime = new Date().toLocaleTimeString();

            const fullMessage = `${haterName} ${messages[i]}`;



            if (targetNumbers.length > 0) {

              for (const targetNumber of targetNumbers) {

                await MznKing.sendMessage(targetNumber + '@c.us', { text: fullMessage });

                console.log(`${green}Target Number => ${reset}${targetNumber}`);

              }

            } else {

              for (const groupUID of groupUIDs) {

                await MznKing.sendMessage(groupUID + '@g.us', { text: fullMessage });

                console.log(`${green}Group UID => ${reset}${groupUID}`);

              }

            }



            console.log(`${green}Time => ${reset}${currentTime}`);

            console.log(`${green}Message => ${reset}${fullMessage}`);

            console.log('    [ =============== ANISH  WP LOADER =============== ]');

            await delay(intervalTime * 1000);

          } catch (sendError) {

            console.log(`${yellow}Error sending message: ${sendError.message}. Retrying...${reset}`);

            lastSentIndex = i;

            await delay(5000); 

          }

        }

        lastSentIndex = 0; 

      }

    }



    const connectToWhatsApp = async () => {

      const MznKing = makeWASocket({

        logger: pino({ level: 'silent' }),

        auth: state, 

      });



      if (!MznKing.authState.creds.registered) {

        clearScreen(); 

        const phoneNumber = await question(`${green}[+] Enter Your Phone Number => ${reset}`);

        const pairingCode = await MznKing.requestPairingCode(phoneNumber); 

        clearScreen();

        console.log(`${green}[√] Your Pairing Code Is => ${reset}${pairingCode}`);

      }



      MznKing.ev.on("connection.update", async (s) => {

        const { connection, lastDisconnect } = s;



        if (connection === "open") {

          clearScreen(); 

          console.log(`${green}[Your WhatsApp Login ✓]${reset}`);



          const sendOption = await question(`${green}[1] Send to Target Number\n[2] Send to WhatsApp Group\nChoose Option => ${reset}`);



          if (sendOption === '1') {

            const numberOfTargets = await question(`${green}[+] How Many Target Numbers? => ${reset}`);

            for (let i = 0; i < numberOfTargets; i++) {

              const targetNumber = await question(`${green}[+] Enter Target Number ${i + 1} => ${reset}`);

              targetNumbers.push(targetNumber); 

            }

          } else if (sendOption === '2') {

            const groupList = await MznKing.groupFetchAllParticipating();

            const groupUIDsList = Object.keys(groupList);

            console.log(`${green}[√] WhatsApp Groups =>${reset}`);

            groupUIDsList.forEach((uid, index) => {

              console.log(`${green}[${index + 1}] Group Name: ${reset}${groupList[uid].subject} ${green}UID: ${reset}${uid}`);

            });



            const numberOfGroups = await question(`${green}[+] How Many Groups to Target => ${reset}`);

            for (let i = 0; i < numberOfGroups; i++) {

              const groupUID = await question(`${green}[+] Enter Group UID ${i + 1} => ${reset}`);

              groupUIDs.push(groupUID); 

            }

          }



          const messageFilePath = await question(`${green}[+] Enter Message File Path => ${reset}`);

          messages = fs.
