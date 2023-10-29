// para que las funciones del cliente sean compatibles con  los server components
'use client';

import Button from "@/app/components/Button";
import Input from "@/app/components/inputs/Input";
import { use, useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import AuthSocialButton from "./AuthSocialButton";
import { BsGithub, BsGoogle } from 'react-icons/bs';
import axios from "axios";
import { toast } from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Variant = 'INICIO' | 'REGISTRO';

const AuthForm = () => {

    const session = useSession();
    const router = useRouter();
    const [variante, setVariante] = useState<Variant>('INICIO');
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        if (session?.status === 'authenticated'){
            console.log('authenticated')
            router.push('/users');
        }
    }, [session?.status, router]);

    const toggleVariant = useCallback(() => {

        if (variante === 'INICIO') {
            setVariante('REGISTRO')
        } else {
            setVariante('INICIO')
        }
    }, [variante]);

    const {
        register,
        handleSubmit,
        formState: {
            errors
        }
    } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setCargando(true);

        if (variante === 'REGISTRO') {
            axios.post('/api/register', data)
            .then(() => signIn('credentials', data))
                .catch(() => toast.error('PONÉ BIEN TUS DATOS MALPARIDO'))
                .finally(() => setCargando(false))
        }

        if (variante === 'INICIO') {
            signIn('credentials', {
                ...data,
                redirect: false
            })
                .then((callback) => {
                    if (callback?.error) {
                        toast.error('PONÉ BIEN TUS DATOS MALPARIDO')
                    }

                    if (callback?.ok && !callback?.error) {
                        toast.success('Bn ahí manito')
                    }
                })
                .finally(() => setCargando(false));
        }
    }

    const socialAction = (action: string) => {
        setCargando(true);

        signIn(action, { redirect: false })
            .then((callback) => {
                if (callback?.error) {
                    toast.error('PONÉ BIEN TUS DATOS MALPARIDO')
                }

                if (callback?.ok && !callback?.error) {
                    toast.success('Bn ahí manito');
                    router.push('/users');
                }
            })
            .finally(() => setCargando(false));
    }

    return (
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
                <form
                    className="space-y-6"
                    onSubmit={handleSubmit(onSubmit)}
                > {/* Se aplica (margin-y) entre los elementos hijos del formulario */}
                    {variante === 'REGISTRO' && (
                        <Input
                            id="name"
                            label="Nombre"
                            register={register}
                            errors={errors}
                            disabled={cargando} />
                    )}
                    <Input
                        id="email"
                        label="Correo electrónico"
                        register={register}
                        errors={errors}
                        disabled={cargando} />
                    <Input
                        id="password"
                        label="Contraseña"
                        register={register}
                        errors={errors}
                        disabled={cargando} />
                    <div>
                        <Button disabled={cargando}
                            fullWidth type="submit">{variante === "INICIO" ? 'Va pa esa mani' : 'Toca registro papi'} </Button>
                    </div>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-gray-500">O si quiere inicie sesión con uno de estos mani</span>
                        </div>
                    </div>
                    <div className="mt-6 flex gap-2">
                        <AuthSocialButton icon={BsGithub} onClick={() => socialAction('github')} />
                        <AuthSocialButton icon={BsGoogle} onClick={() => socialAction('google')} />
                    </div>
                    <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
                        <div>{variante === 'INICIO' ? '¿Sos nuevo en ColoChat?' : 'Ya tengo cuenta bro'}</div>
                        <div onClick={toggleVariant} className="underline cursor-pointer">
                            {variante === 'INICIO' ? 'Crear una cuenta' : 'Iniciar sesión'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default AuthForm