import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function AuthPage() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [authMode, setAuthMode] = useState("initial"); // initial, signIn, login

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithOtp({ email });
        if (error) {
            alert(error.message);
        } else {
            alert("Check your email for the login link!");
        }
        setLoading(false);
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithOtp({ email });
        if (error) {
            alert(error.message);
        } else {
            alert("Check your email to complete the sign-up process!");
        }
        setLoading(false);
    };

    const renderInitial = () => (
        <div className="grid grid-cols-2 gap-4">
            <Button onClick={() => setAuthMode("signIn")} className="w-full">Sign In</Button>
            <Button onClick={() => setAuthMode("login")} className="w-full">Login</Button>
        </div>
    );

    const renderLogin = () => (
        <form onSubmit={handleLogin}>
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="me@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Sending..." : "Send Magic Link"}
                </Button>
                <Button variant="outline" onClick={() => setAuthMode("initial")}>Back</Button>
            </div>
        </form>
    );

    const renderSignIn = () => (
        <form onSubmit={handleSignUp}>
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="me@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                        id="fullName"
                        type="text"
                        placeholder="John Doe"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                        id="username"
                        type="text"
                        placeholder="johndoe"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Sending..." : "Sign Up"}
                </Button>
                <Button variant="outline" onClick={() => setAuthMode("initial")}>Back</Button>
            </div>
        </form>
    );

    return (
        <div className="flex items-center justify-center min-h-screen min-w-screen bg-gray-100">
            <Card className="w-[500px] bg-white shadow-lg">
                <CardHeader>
                    <CardTitle>{authMode === 'signIn' ? 'Sign Up' : 'Login'}</CardTitle>
                    <CardDescription>
                        {authMode === 'initial' && 'Choose an option to continue'}
                        {authMode === 'login' && 'Enter your email to receive a magic link.'}
                        {authMode === 'signIn' && 'Enter your details to create an account.'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {authMode === 'initial' && renderInitial()}
                    {authMode === 'login' && renderLogin()}
                    {authMode === 'signIn' && renderSignIn()}
                </CardContent>
            </Card>
        </div>
    );
}

