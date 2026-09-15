
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    login,
    verifyTwoFactor,
    createTwoFactor,
    verifyTwoFactorSetup,
} from "../services/authapi";
import { QRCodeSVG } from "qrcode.react";
import "../assets/css/Login.css";

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [needsSetup, setNeedsSetup] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState("");
    const [totpCode, setTotpCode] = useState("");
    const [modalError, setModalError] = useState("");
    const [modalLoading, setModalLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const res = await login({ email, password });

            if (res.requires_2fa_setup) {
                const setupRes = await createTwoFactor();

                setNeedsSetup(true);
                setQrCodeUrl(setupRes.qr_code_url);
                setShowModal(true);
            } else if (res.requires_2fa) {
                setNeedsSetup(false);
                setQrCodeUrl("");
                setShowModal(true);
            }
        } catch (err) {
            setError(err.message || "Usuario o contraseña incorrectos");
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();

        setModalError("");
        setModalLoading(true);

        try {
            if (needsSetup) {
                await verifyTwoFactorSetup({
                    totp_code: totpCode,
                });
            } else {
                await verifyTwoFactor({
                    totp_code: totpCode,
                });
            }

            setShowModal(false);
            navigate("/dashboard");
        } catch (err) {
            setModalError(err.message || "Código 2FA inválido");
        } finally {
            setModalLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h1 className="login-title">Iniciar sesión</h1>

                <form onSubmit={handleLogin} className="login-form">
                    <div className="form-group">
                        <label className="form-label">
                            Usuario
                        </label>

                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Contraseña
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-input"
                            required
                        />
                    </div>

                    {error && (
                        <p className="login-error">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="login-button"
                    >
                        {loading ? "Entrando..." : "Entrar"}
                    </button>
                </form>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="two-factor-modal">
                        <h2 className="two-factor-title">
                            Verificación en dos pasos
                        </h2>

                        {needsSetup && (
                            <div className="two-factor-setup">
                                <p className="two-factor-description">
                                    Escanea este código QR con tu app de
                                    autenticación (Google Authenticator,
                                    Authy, etc.)
                                </p>

                                {qrCodeUrl && (
                                    <div className="qr-container">
                                        <QRCodeSVG
                                            value={qrCodeUrl}
                                            size={200}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        <form
                            onSubmit={handleVerify}
                            className="two-factor-form"
                        >
                            <div className="form-group">
                                <label className="form-label">
                                    Código de verificación
                                </label>

                                <input
                                    type="text"
                                    value={totpCode}
                                    onChange={(e) =>
                                        setTotpCode(e.target.value)
                                    }
                                    className="form-input verification-input"
                                    maxLength={6}
                                    inputMode="numeric"
                                    autoComplete="one-time-code"
                                    required
                                    autoFocus
                                />
                            </div>

                            {modalError && (
                                <p className="login-error">
                                    {modalError}
                                </p>
                            )}

                            <div className="modal-buttons">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="cancel-button"
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    disabled={modalLoading}
                                    className="verify-button"
                                >
                                    {modalLoading
                                        ? "Verificando..."
                                        : "Verificar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

