const API_AUTH = "http://localhost:8000/api/login";

export async function login(credentials) {
	try {
		const response = await fetch(API_AUTH, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
            credentials: 'include',
			body: JSON.stringify(credentials),
            
		});
		if (!response.ok) {
			throw new Error("Error en la autenticación");
		}
		return await response.json();
	} catch (error) {
		console.error(error);
		throw error;
	}

};

export async function logout() {
	try {
		const response = await fetch("http://localhost:8000/api/logout", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});
		if (!response.ok) {
			throw new Error("Error al cerrar sesión");
		}
		return await response.json();
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function createTwoFactor() {
    const response = await fetch("http://localhost:8000/api/2fa/setup", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
           
        },
          credentials: 'include',
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(
            data.message || "Error al configurar la autenticación de dos factores"
        );
    }

    return await response.json();
}

export async function verifyTwoFactorSetup(credentials) {
    const response = await fetch("http://localhost:8000/api/2fa/setup/verify", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
           
        },
        credentials: 'include',
        body: JSON.stringify(credentials),

    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Código 2FA inválido");
    }

    return await response.json();
}

export async function verifyTwoFactor(credentials) {
    const response = await fetch("http://localhost:8000/api/2fa/verify", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Código 2FA inválido");
    }

    return await response.json();
}


