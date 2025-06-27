import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Glassmorphism } from "@/components/ui/glassmorphism";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminLoginModal({ isOpen, onClose }: AdminLoginModalProps) {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Check credentials
    if (username === "borabora" && password === "28934f_EF_#R") {
      // Simulate authentication
      localStorage.setItem("admin-session", "authenticated");
      localStorage.setItem("admin-role", "admin");
      localStorage.setItem("admin-user", JSON.stringify({
        username: "borabora",
        role: "admin",
        permissions: ["all"]
      }));
      
      setTimeout(() => {
        setIsLoading(false);
        onClose();
        setLocation("/admin");
      }, 1000);
    } else {
      setTimeout(() => {
        setIsLoading(false);
        setError("Неверные учетные данные");
        setUsername("");
        setPassword("");
      }, 1000);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md"
        >
          <Glassmorphism className="p-8 rounded-xl border border-white/20">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                <i className="fas fa-shield-alt text-2xl text-red-400"></i>
              </div>
              <h2 className="text-2xl font-bold mb-2">System Access</h2>
              <p className="text-white/70">Restricted Administrative Panel</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-black/40 border-white/20 text-white placeholder-white/50"
                  required
                />
              </div>
              
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-black/40 border-white/20 text-white placeholder-white/50"
                  required
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded"
                >
                  {error}
                </motion.div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Authenticating...
                    </div>
                  ) : (
                    "Access"
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center text-xs text-white/40">
              Authorized personnel only. All access is logged.
            </div>
          </Glassmorphism>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}