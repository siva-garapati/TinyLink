"use client";

import { useState } from "react";
import { Link as LinkIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { LinkData } from "@/types/link";

interface CreateLinkFormProps {
    onSuccess?: (data: LinkData) => void;
}

const CreateLinkForm = ({ onSuccess }: CreateLinkFormProps) => {
    const [form, setForm] = useState({ url: "", code: "" });
    const [errors, setErrors] = useState<{ url?: string; code?: string }>({});
    const [loading, setLoading] = useState(false);

    const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;

    const validateUrl = (v: string) => {
        if (!v.trim()) return "URL is required";
        try {
            new URL(v.trim());
            return;
        } catch {
            return "Please enter a valid URL";
        }
    };

    const validateCode = (v: string) => {
        if (!v) return;
        if (!CODE_REGEX.test(v)) return "Custom code must be 6–8 letters/numbers";
        return;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const urlError = validateUrl(form.url);
        const codeError = validateCode(form.code);

        setErrors({ url: urlError, code: codeError });
        if (urlError || codeError) return;

        setLoading(true);

        try {
            const res = await fetch("/api/links", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: form.url.trim(), code: form.code || undefined }),
            });

            if (res.status === 409) {
                const body = await res.json().catch(() => ({}));
                setErrors((s) => ({ ...s, code: body?.message || "Code already exists" }));
                setLoading(false);
                return;
            }

            if (!res.ok) {
                const body = await res.text();
                throw new Error(body || "Failed to create link");
            }

            const data = await res.json();

            const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
            toast.success(`Your short link is ready: ${BASE_URL}/${data.code}`);

            setForm({ url: "", code: "" });

            onSuccess?.(data);
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong while creating your link.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rounded-lg border border-[#00000030] bg-[hsl(0,0%,100%)] text-[hsl(var(--card-foreground))] shadow-md p-6">
            <div className="flex items-center gap-2 mb-6">
                <LinkIcon className="h-5 w-5 text-[hsl(210%, 100%, 50%" />
                <h2 className="text-xl font-semibold">Create New Link</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="url" className="text-sm font-medium">
                        Destination URL
                    </label>
                    <input
                        id="url"
                        type="url"
                        placeholder="https://example.com/your-long-url"
                        value={form.url}
                        onChange={(e) => {
                            setForm((prev) => ({ ...prev, url: e.target.value }));
                            if (errors.url) {
                                setErrors((prev) => ({
                                    ...prev,
                                    url: validateUrl(e.target.value),
                                }));
                            }
                        }}
                        onBlur={() =>
                            setErrors((prev) => ({ ...prev, url: validateUrl(form.url) }))
                        }
                        className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${errors.url ? "border-red-500" : "border-gray-300"
                            }`}
                    />
                    {errors.url && (
                        <p className="text-xs text-red-600">{errors.url}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label htmlFor="code" className="text-sm font-medium">
                        Custom Code (optional)
                    </label>
                    <input
                        id="code"
                        type="text"
                        placeholder="my-custom-link"
                        value={form.code}
                        onChange={(e) => {
                            setForm((prev) => ({ ...prev, code: e.target.value }));
                            if (errors.code) {
                                setErrors((prev) => ({
                                    ...prev,
                                    code: validateCode(e.target.value),
                                }));
                            }
                        }}
                        onBlur={() =>
                            setErrors((prev) => ({
                                ...prev,
                                code: validateCode(form.code),
                            }))
                        }
                        className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${errors.code ? "border-red-500" : "border-gray-300"
                            }`}
                    />
                    {errors.code ? (
                        <p className="text-xs text-red-600">{errors.code}</p>
                    ):

                    (<p className="text-xs text-gray-500">
                        Leave empty to generate a random code
                    </p>)}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none cursor-pointer disabled:opacity-50 bg-black text-white hover:bg-black/90 h-10 px-4 py-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Creating...
                        </>
                    ) : (
                        "Create Short Link"
                    )}
                </button>
            </form>
        </div>
    );
};

export default CreateLinkForm;