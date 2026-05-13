//mail junia
const champEmail = document.querySelector("#email");
const erreurEmail = document.createElement("span");
erreurEmail.classList.add("erreur");
champEmail.parentElement.appendChild(erreurEmail);

champEmail.addEventListener("input", () => {
    const email = champEmail.value.trim();

    if (email === "") {
        erreurEmail.textContent = "";
        champEmail.classList.remove("invalide", "valide");
    } else if (!email.endsWith("@junia.com")) {
        erreurEmail.textContent = "❌ Utilisez votre adresse @junia.com";
        champEmail.classList.add("invalide");
        champEmail.classList.remove("valide");
    } else {
        erreurEmail.textContent = "✅ Email valide";
        champEmail.classList.add("valide");
        champEmail.classList.remove("invalide");
    }
});

//compteur
const champMotivation = document.querySelector("#motivation");
const compteur = document.createElement("small");
compteur.classList.add("compteur");
champMotivation.parentElement.appendChild(compteur);

const MAX_CARACTERES = 500;

const mettreAJourCompteur = () => {
    const longueur = champMotivation.value.length;
    compteur.textContent = `${longueur} / ${MAX_CARACTERES} caractères`;
    compteur.style.color = longueur > 450 ? "var(--orange)" : "var(--noir)";
};

champMotivation.addEventListener("input", mettreAJourCompteur);
mettreAJourCompteur();    

//apercu cv 
const formulaire = document.querySelector("#form-cv");
const apercuContenu = document.querySelector("#apercu-contenu");

const formaterDomaines = () => {
    const domaineSelectionne = formulaire.querySelector('input[name="domaines"]:checked');

    if (!domaineSelectionne) {
        return "—";
    }

    const libelles = {
        stage: "Stage",
        alternance: "Alternance",
        cdi: "CDI",
        mobilite: "Mobilité",
    };

    return libelles[domaineSelectionne.value] || domaineSelectionne.value;
};

const mettreAJourApercu = () => {
    const donnees = new FormData(formulaire);

    apercuContenu.innerHTML = `
        <h3>${donnees.get("prenom") || "Prénom"} ${donnees.get("nom") || "Nom"}</h3>
        <p>📧 ${donnees.get("email") || "—"}</p>
        <p>📞 ${donnees.get("telephone") || "—"}</p>
        <p>🎂 Né(e) le ${donnees.get("date-naissance") || "—"}</p>
        <p>🔎 ${formaterDomaines()}</p>
        <h4>Lettre de motivation</h4>
        <p>${donnees.get("motivation") || "—"}</p>
    `;
};

if (formulaire && apercuContenu) {
    formulaire.addEventListener("input", mettreAJourApercu);
    mettreAJourApercu();
}

//persistance
formulaire.addEventListener("input", () => {
    const donnees = {};
    new FormData(formulaire).forEach((value, cle) => {
        donnees[cle] = value;
    });
    localStorage.setItem("cv-junia", JSON.stringify(donnees));
});

window.addEventListener("DOMContentLoaded", () => {
    const sauvegarde = localStorage.getItem("cv-junia");
     if (!sauvegarde) return;

    const donnees = JSON.parse(sauvegarde);
    for (const [cle, valeur] of Object.entries(donnees)) {
        const champs = formulaire.querySelectorAll(`[name="${cle}"]`);
        if (champs.length === 0) {
            continue;
        }

        if (champs[0].type === "radio") {
            champs.forEach((champ) => {
                champ.checked = Array.isArray(valeur) ? valeur.includes(champ.value) : champ.value === valeur;
            });
        } else {
            const champ = champs[0];
            champ.value = valeur;
        }
    }
    mettreAJourApercu();
});

//notif
formulaire.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!champEmail.value.endsWith("@junia.com")) {
        alert("⚠️ Merci d'utiliser votre adresse JUNIA.");
        return;
    }

    // Plus tard : envoi vers PHP via fetch
    /*
    console.log("✅ CV généré :", Object.fromEntries(new FormData(formulaire)));

    afficherNotification("✅ Votre CV a bien été enregistré !");
    localStorage.removeItem("cv-junia");
    formulaire.reset();
    mettreAJourApercu();*/
});

const afficherNotification = (message) => {
    const notif = document.createElement("div");
    notif.classList.add("notification");
    notif.textContent = message;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);
};

//mode sombre
const boutonTheme = document.querySelector("#theme-toggle");
const cleTheme = "theme-cv";

const appliquerTheme = (estSombre) => {
    document.body.classList.toggle("theme-sombre", estSombre);
    if (boutonTheme) {
        boutonTheme.textContent = estSombre ? "Mode clair" : "Mode sombre";
        boutonTheme.setAttribute("aria-pressed", String(estSombre));
    }
};

const themeEnregistre = localStorage.getItem(cleTheme) === "sombre";
appliquerTheme(themeEnregistre);

if (boutonTheme) {
    boutonTheme.addEventListener("click", () => {
        const nouveauThemeSombre = !document.body.classList.contains("theme-sombre");
        appliquerTheme(nouveauThemeSombre);
        localStorage.setItem(cleTheme, nouveauThemeSombre ? "sombre" : "clair");
    });
}