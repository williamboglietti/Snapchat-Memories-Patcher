# 👻 Snapchat Memories Export Fixer & Bulk Downloader

![Version](https://img.shields.io/badge/version-v1.23-green) ![Status](https://img.shields.io/badge/status-stable-blue)

Un patch JavaScript "tout-en-un" à injecter dans votre fichier `memories_history.html` (fourni par l'export de données Snapchat) pour réparer les liens de téléchargement cassés et automatiser la récupération de vos photos et vidéos.

## ⚠️ Le Problème
Lorsque vous demandez un export de vos données Snapchat ("My Data"), le fichier HTML fourni contient souvent des scripts qui :
1. Provoquent des erreurs **HTTP 503 (Service Unavailable)** lors du téléchargement.
2. Bloquent le téléchargement de masse après quelques fichiers.
3. Ne permettent pas de reprendre là où on s'est arrêté en cas de rafraîchissement de la page.
4. Téléchargent les fichiers sans extensions sur Windows.

## ✅ La Solution
Ce script remplace silencieusement la logique défaillante de Snapchat par un **gestionnaire de téléchargement moderne**.

### Fonctionnalités
* **Correction Erreur 503** : Utilise une méthode hybride (Fetch API + Fallback XHR) pour contourner les blocages serveurs.
* **Console de Contrôle (Dashboard)** : Une interface flottante et déplaçable en bas à gauche pour suivre l'avancement.
* **Barre de Progression Persistante** : Sauvegarde l'état dans la mémoire du navigateur. Si vous fermez la page et revenez, la barre reprend là où elle était (ex: 450/1200).
* **File d'Attente Intelligente** : Télécharge les fichiers un par un (séquentiel) pour éviter de surcharger le réseau.
* **Pause & Reprise** : Un bouton Pause réel qui permet d'arrêter le téléchargement et de le reprendre plus tard.
* **Extensions Automatiques** : Détecte le type de fichier (image/video) et force l'extension `.jpg` ou `.mp4` si elle manque.
* **Master Switch** : Un interrupteur en haut à droite pour activer/désactiver le patch instantanément.
* **Clean UI** : Masque le bouton original défaillant et ajoute un tampon "PATCHED" sur le logo pour confirmer l'installation.

## 🚀 Installation

Pas besoin d'installer Python ou des logiciels tiers. Tout se passe dans le fichier HTML.

1.  Téléchargez votre archive de données depuis Snapchat et extrayez-la.
2.  Ouvrez le fichier `html/memories_history.html` avec un éditeur de texte (Bloc-notes, Notepad++, VS Code...).
3.  Allez tout en bas du fichier, juste avant la balise de fermeture `</body>` ou `</html>`.
4.  Copiez l'intégralité du script fourni dans ce projet (fichier `script_patch_v1.23.js`).
5.  Collez le script à la fin du fichier HTML.
6.  Sauvegardez le fichier.

## 🎮 Utilisation

1.  Ouvrez le fichier `memories_history.html` modifié dans votre navigateur (Chrome, Edge, Firefox, etc.).
2.  Vous verrez un interrupteur **"Patch v1.23"** en haut à droite (activé par défaut) et un tampon rouge **"PATCHED"** sur le fantôme Snapchat.
3.  Une console noire apparaît en bas à gauche.
4.  Cliquez sur le bouton vert **"▶️ Démarrer"**.
5.  Laissez faire ! 
    * *Astuce : Vous pouvez régler la vitesse sur "Lent" si vous avez une moins bonne connexion.*

## 🛠️ Dépannage

* **Le téléchargement s'arrête ?** Cliquez sur "Pause" puis "Reprendre".
* **Je veux tout recommencer ?** Cliquez sur le bouton "🔄 Reset" dans la console. Cela effacera la mémoire et rechargera la page.
* **Erreur ⚠️ (HTTP 403/404) ?** Certains très vieux liens fournis par Snapchat peuvent être expirés côté serveur. Le script les marquera en jaune et passera au suivant automatiquement.

## 📜 Disclaimer
Ce projet n'est pas affilié à Snapchat Inc. Il s'agit d'un outil open-source développé pour aider les utilisateurs à récupérer leurs propres données (Data Privacy). Utilisez-le à vos propres risques.

---
*Développé avec ❤️ pour sauver nos souvenirs.*
