import nodemailer from 'nodemailer'
import { dueProblems } from '../controllers/problemController.js';


export const sendReminderEmail = async(email,dueProblems)=>{
try{
    const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL,
        pass:process.env.EMAIL_PASSWORD
    }
});

    
const problemList = dueProblems
    .map(problem => {
        const leetcodeUrl =
            `https://leetcode.com/problems/${problem.problemId.titleSlug}/`;

        return `
            <li>
                <a href="${leetcodeUrl}">
                    ${problem.problemId.title}
                </a>
            </li>
        `;
    })
    .join("");

    await transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: "RecallCode Daily Review",
        html:
        `<h2>Today's Due Problems</h2>

            <p>Click a problem to open it on LeetCode:</p>

            <ul>
                ${problemList}
            </ul>`
});
}catch(error){
    console.error(`Failed to send email to ${email}:`, error);
}
}