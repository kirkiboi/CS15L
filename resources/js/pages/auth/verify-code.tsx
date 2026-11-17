import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';

type Props = {
    email: string;
    status?: string;
};

export default function VerifyCode({ status }: Props) {
    return (
        <>
            <Head />
            <div className="flex flex-col gap-6">
                <div className="grid gap-2 text-center">
                    <p className="text-sm text-muted-foreground">
                        Please enter the verification code sent to your email
                    </p>
                </div>

                {status && (
                    <div className="text-center text-sm font-medium text-green-600">
                        {status}
                    </div>
                )}

                <Form
                    action="/verify-code"
                    method="post"
                    className="flex flex-col gap-6"
                    disableWhileProcessing
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="code">Verification code</Label>

                                <Input
                                    id="code"
                                    name="code"
                                    type="text"
                                    inputMode="numeric"
                                    autoComplete="one-time-code"
                                    maxLength={6}
                                    pattern="[0-9]{6}"
                                    placeholder="123456"
                                    required
                                    autoFocus
                                    className="text-center text-lg tracking-[0.4em]"
                                />
                                <InputError message={errors.code} />
                            </div>

                            <Button
                                type="submit"
                                className="w-full hover:cursor-pointer"
                                disabled={processing}
                            >
                                {processing && <Spinner />}
                                Verify email
                            </Button>
                        </>
                    )}
                </Form>

                <div className="flex flex-col gap-2 text-center">
                    <p className="text-sm text-muted-foreground">
                        Didn't receive the code?
                    </p>

                    <Form
                        action="/verify-code/resend"
                        method="post"
                        disableWhileProcessing
                    >
                        {({ processing, errors }) => (
                            <>
                                <Button
                                    type="submit"
                                    variant="secondary"
                                    className="w-full hover:cursor-pointer"
                                    disabled={processing}
                                >
                                    {processing && <Spinner />}
                                    Resend verification code
                                </Button>

                                <InputError
                                    message={errors.resend}
                                    className="mt-2"
                                />
                            </>
                        )}
                    </Form>
                </div>

                <p className="text-center text-sm text-muted-foreground">
                    Already verified? <TextLink href={login()}>Log in</TextLink>
                </p>
            </div>
        </>
    );
}
