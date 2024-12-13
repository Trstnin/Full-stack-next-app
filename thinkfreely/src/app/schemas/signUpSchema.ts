import {z} from 'zod'

export const usernameValidation = z 
.string()
.min(2,"Username must be atleast 2 characters")
.max(20, "Username must ne more then 20 character ")
.regex(/^[a-zA-Z0-9_]+$/,"Username mus not contain special character ")

export const signUpSchema = z.object({
    username :usernameValidation,
    email: z.string().email({message: "In valid email address"}),
    password: z.string().min(8, {message:"Passeord must be atleast 8 character"})

})