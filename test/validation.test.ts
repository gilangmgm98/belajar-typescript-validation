import { RefinementCtx, z, ZodError } from "zod"

describe('zod', () => {


    it('should support validations', () => {

        const schema = z.string().min(4).max(25)

        let validate1 = schema.parse('Gilang')
        // let validate2 = schema.parse('Haris')
        // let validate3 = schema.parse('Lega')
        // let validate4 = schema.parse('Rey')
        // let validate5 = schema.parse('Syu')

        console.log(validate1)
        // console.log(validate2)
        // console.log(validate3)
        // console.log(validate4)
        // console.log(validate5)

        expect(validate1).toBe
    })

    it('it should support primitive data type validation', () => {

        const usernameSchema = z.string().email()
        const isAdminSchema = z.boolean()
        const priceSchema = z.number().min(1000).max(100000)

        const username = usernameSchema.parse('gilangmgm@gmail.com')
        console.info(username);

        const isAdmin = isAdminSchema.parse(false)
        console.info(isAdmin)

        const price = priceSchema.parse(5000)
        console.info(price)

    })

    it('should support data conversion', () => {

        const usernameSchema = z.coerce.string().email()
        const isAdminSchema = z.coerce.boolean()
        const priceSchema = z.coerce.number().min(1000).max(100000)

        const username = usernameSchema.parse('gilangmgm@gmail.com')
        console.info(username);

        const isAdmin = isAdminSchema.parse(false)
        console.info(isAdmin)

        const price = priceSchema.parse(5000)
        console.info(price)
    })

    it('should support date validation', () => {

        const birthdateSchema = z.coerce.date().min(new Date(1990, 0, 1)).max(new Date(2010, 0, 1))

        const birthdate = birthdateSchema.parse('1995-05-20')
        console.info(birthdate)

        const birthdate2 = birthdateSchema.parse(new Date(1998, 10, 30))
        console.info(birthdate2)

    })

    it('should return zod error if invalid', async () => {

        const schema = z.coerce.string().email().max(25)

        try {
            schema.parse('tehe')
        } catch (error) {
            if (error instanceof ZodError) {
                error.errors.forEach((error) => {
                    console.info(error.message)
                })
            }
        }
    })

    it('should return zod error if invalid without exception', async () => {

        const schema = z.coerce.string().min(3).max(15)
        const result = schema.safeParse('Muhammad Gilang Murdiyanto')

        if (result.success) {
            console.info(result.data)
        } else {
            let errAr = result.error.message
            console.info(errAr)
        }
    })

    it('should can validate object with zod', async () => {

        const loginSchema = z.object({
            username: z.coerce.string().email(),
            password: z.coerce.string().min(8).max(30),
            isAdmin: z.coerce.boolean()
        })

        const user = {
            username: 'gilangmgm@gmail.com',
            password: '1234',
            isAdmin: false
        }

        try {
            const result = loginSchema.parse(user)
            console.info(result)
        } catch (error) {
            if (error instanceof ZodError) {
                error.errors.forEach((error) => {
                    console.info(error.message)
                })
            }
        }
    })

    it('should can validate nested object with zod', async () => {
        const userSchema = z.object({
            username: z.coerce.string().email(),
            password: z.coerce.string().min(8).max(30),
            isAdmin: z.coerce.boolean(),
            profile: z.object({
                name: z.coerce.string().min(3).max(25),
                birthdate: z.coerce.date().min(new Date(1990, 0, 1)).max(new Date(2010, 0, 1))
            })
        })

        try {
            const user = {
                username: 'gilangmgm@gmail.com',
                password: '12345678',
                isAdmin: false,
                profile: {
                    name: 'Muhammad Gilang Murdiyanto',
                    birthdate: '1995-05-20'
                }
            }
            const result = userSchema.parse(user)
            console.info(result)
        } catch (error) {
            if (error instanceof ZodError) {
                error.errors.forEach((error) => {
                    console.info(error.message)
                })
            }
        }
    })

    it('should can validate array', async () => {
        const arraySchema = z.array(z.coerce.string().email()).min(1).max(15)

        try {
            const request: Array<string> = ['a', 'budi@gmailcom.com']
            const result: Array<string> = arraySchema.parse(request)
            console.info(result);
        } catch (error) {
            if (error instanceof ZodError) {
                error.errors.forEach((error) => {
                    console.info(error.message)
                })
            }
        }
    })

    it('should can validate set', async () => {
        const setSchema = z.set(z.coerce.string()).min(1).max(5)

        try {
            const request: Set<string> = new Set(['a', 'budi@gmail.com', 'c', 'budi@gmail.com', 'e'])
            const result: Set<string> = setSchema.parse(request)
            console.info(result);
        } catch (error) {
            if (error instanceof ZodError) {
                error.errors.forEach((error) => {
                    console.info(error.message)
                })
            }
        }
    })

    it('should can validate map', async () => {
        const mapSchema = z.map(z.coerce.string(), z.coerce.string().email())

        try {
            const request: Map<string, string> = new Map([['a', 'gilang@gmail.com'], ['b', 'budi'], ['c', 'gilang']])
            const result: Map<string, string> = mapSchema.parse(request)
            console.info(result);
        } catch (error) {
            if (error instanceof ZodError) {
                error.errors.forEach((error) => {
                    console.info(error.message)
                })
            }
        }
    })

    it('should can validate object with custom message', async () => {
        const loginSchema = z.object({
            username: z.string().email('please check and use email format'),
            password: z.string().min(8, 'Password must more than 8 characters').max(30, 'Password must less than 30 characters'),
            isAdmin: z.coerce.boolean()
        })

        const user = {
            username: 'gilangmgm@gmail.com',
            password: '1234',
            isAdmin: false
        }

        try {
            const result = loginSchema.parse(user)
            console.info(result)
        } catch (error) {
            if (error instanceof ZodError) {
                error.errors.forEach((error) => {
                    console.info(error.message)
                })
            }
        }
    })

    it('should can support optional validation', async () => {
        const registerSchema = z.object({
            username: z.string().email(),
            firstName: z.string().min(3),
            lastName: z.string().min(3).max(100).optional(),
            password: z.string().min(8, 'Password must more than 8 characters').max(30, 'Password must less than 30 characters'),
            isAdmin: z.coerce.boolean().optional()
        })

        const request = {
            username: 'gilangmgm@gmail.com',
            firstName: 'Muhammad',
            password: '123432'
        }

        try {
            const result = registerSchema.parse(request)
            console.info(result)
        } catch (error) {
            if (error instanceof ZodError) {
                error.errors.forEach((error) => {
                    console.info(error.message)
                })
            }
        }
    })

    //transform = melakukan transform data / manipulate data setelah di validasi
    it('should can support transform', async () => {
        const schema = z.string().transform((data) => {
            return data.toUpperCase()
        })

        try {
            const result = schema.parse('Gilang Murdiyanto')
            console.info(result)
        } catch (error) {
            if(error instanceof ZodError) {
                error.errors.forEach((error) => {
                    console.info(error.message)
                })
            }
        }
    })

    function mustUpperCase(data: string, ctx: RefinementCtx): string {
        if(data != data.toUpperCase()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Username must be in uppercase',
            })
            return z.NEVER
        }else{
            return data
        }
    }

    it('should can support create custom validation', async () => {
        const schema = z.object({
            username: z.string().transform(mustUpperCase),
            password: z.string().min(8, 'Password must more than 8 characters').max(30, 'Password must less than 30 characters')
        })

        try {
            const result = schema.parse({
                username: 'gilangmgm',
                password: '12345678'
            })
            console.info(result)
        } catch (error) {
            if(error instanceof ZodError) {
                error.errors.forEach((error) => {
                    console.info(error.message)
                })
            }
        }
    })
})