import { resend } from "../lib/resend";
import VerificationEmail from "../../../emails/VerificationEmails";
import { ApiResponse } from "../types/ApiResponse";
import { verify } from "crypto";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse>{
       try {
        const { data, error } = await resend.emails.send({
            from: '<onboarding@resend.dev>',
            to: email,
            subject: 'OpenupFreely | Verificaion code',
            react: VerificationEmail({username, otp: verifyCode}),
          });
        return{sucess: true, message: 'Verification email send successfully'}

       } catch (emailError) {
         console.log("Error sending verification email", emailError);
         return{sucess: false, message: 'Failed to send verification email'}
       }
}

