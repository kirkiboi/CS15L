import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    return (
        <>
            <div className="mb-8 flex flex-col items-center text-center">
                <h1 className="text-3xl font-bold tracking-tight">
                    LetMeSee
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Making sure moments are captured and shared with the world.
                </p>
            </div>

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6">
                {({ processing, errors }) => (
                    <>
                        <div className="mb-1">
                            <h2 className="text-xl font-semibold">
                                Log in to continue to your account.
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                            </p>
                        </div>

                        <div className="grid gap-5">
                            <div className="grid gap-2">
                                <Label htmlFor="email">
                                    Email address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    autoComplete="email"
                                    placeholder="sample@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center justify-between gap-2">
                                    <Label htmlFor="password">
                                        Password
                                    </Label>

                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="text-sm">
                                            Forgot password?
                                        </TextLink>
                                    )}
                                </div>

                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    autoComplete="current-password"
                                    placeholder="Enter your password"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center gap-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                />
                                <Label
                                    htmlFor="remember"
                                    className="font-normal">
                                    Remember me
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-1 w-full"
                                disabled={processing}
                                data-test="login-button">
                                {processing && <Spinner />}
                                {processing ? 'Logging in...' : 'Log in'}
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            New to LetMeSee?{' '}
                            <TextLink href={register()}>
                                Create an account
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>

            {status && (
                <div className="mt-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <p className="mt-8 text-center text-xs text-muted-foreground">
                Your next great shot starts here.
            </p>
        </>
    );
}