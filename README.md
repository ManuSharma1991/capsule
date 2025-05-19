# <img src="YOUR_CAPSULE_LOGO_URL_OR_PATH_HERE_PLACEHOLDER" alt="Capsule Logo" width="50" valign="middle"> Capsule


**Your Noob-Friendly Docker Management Dashboard – Take control of your containers with ease!**

[![Build Status](https://github.com/ManuSharma1991/capsule/actions/workflows/docker-publish.yml/badge.svg?branch=master)](https://github.com/ManuSharma1991/capsule/actions)
[![Docker Pulls](https://img.shields.io/docker/pulls/manuviswanadha/capsule)](https://hub.docker.com/r/manuviswanadha/capsule)
[![License](https://img.shields.io/github/license/ManuSharma1991/capsule)](LICENSE)
![Version](https://img.shields.io/badge/version-v0.1.0--alpha-blue) <!-- Update as you release -->

Capsule is a web-based Docker management tool designed with simplicity and user-friendliness at its core. Say goodbye to complex YAML and cryptic commands. Capsule provides an intuitive "App Store" like experience to deploy and manage popular self-hosted applications like Jellyfin, the *arr stack (Sonarr, Radarr, Prowlarr, Bazarr), and more, all through guided wizards and a clean interface.

---

## ✨ Key Features

*   🚀 **Noob-Friendly Interface:** Designed for users new to Docker. No YAML editing required!
*   🧙 **Wizard-Driven App Deployment:** Install complex applications like Jellyfin or the *arr stack by answering simple questions.
*   📊 **Container Dashboard:** View running containers, their status, CPU/RAM usage at a glance.
*   ▶️ **Simple Controls:** Easily Start, Stop, Restart, and view Logs for your containers.
*   📺 **Deep Jellyfin Integration:** Browse your Jellyfin library, view media details, and play content directly within Capsule using an integrated player. *(Coming Soon for full library view)*
*   🎬 **\*arr Stack Management:** Simplified setup and basic overview for Sonarr, Radarr, Lidarr, Readarr, Prowlarr, and Bazarr. *(Basic deployment now, deeper integration planned)*
*   🔒 **Secure:** Runs as a Docker container, accesses Docker socket securely (be aware of implications).
*   ⚙️ **Self-Hosted:** Your data, your server, your control.

---

## 🤔 Why Capsule?

While tools like Portainer are powerful, they can still be overwhelming for beginners. Capsule aims to bridge that gap by:

1.  **Abstracting Complexity:** We handle the Docker Compose generation behind the scenes.
2.  **Curated Experience:** Focusing on popular self-hosted apps with pre-configured, optimized templates.
3.  **Guided Setup:** Wizards make sure you don't miss crucial configuration steps.
4.  **Integrated Experience:** Access and manage key aspects of your apps (like your Jellyfin library) without leaving Capsule.

---

## 📸 Screenshots

*(This is where you'll embed actual screenshots of your application once it's running!)*

![Capsule Dashboard Placeholder](https://via.placeholder.com/800x450.png?text=Capsule+Dashboard+Screenshot)
*Capsule Dashboard - Overview of your running services.*

![Capsule App Store Placeholder](https://via.placeholder.com/800x450.png?text=Capsule+App+Store+Screenshot)
*Deploying Jellyfin with the Capsule Wizard.*

---

## 🛠️ Prerequisites

*   **Docker Engine:** [Installation Guide](https://docs.docker.com/engine/install/)
*   **Docker Compose:** (Included with Docker Desktop, or [Install Separately](https://docs.docker.com/compose/install/))

---

## 🚀 Quick Start & Installation

1.  **Create a `docker-compose.yml` file:**
    ```yaml
    version: '3.8'

    services:
      capsule:
        image: manuviswanadha/capsule:latest # Your Docker Hub username and image
        container_name: capsule
        restart: unless-stopped
        ports:
          - "10000:10000" # Or your preferred host port
        volumes:
          - /var/run/docker.sock:/var/run/docker.sock # Mount Docker socket
          - capsule_data:/app/data # Persistent storage for Capsule's configuration
        # Optional: Set Timezone
        # environment:
        #   - TZ=America/New_York
    
    volumes:
      capsule_data:
    ```

2.  **Save the file** and run the following command in the same directory:
    ```bash
    docker-compose up -d
    ```

3.  **Access Capsule:** Open your web browser and go to `http://<your-server-ip>:10000` (or `http://localhost:10000` if running locally).

---

## 📦 Initial Supported Applications

Capsule launches with initial wizard-driven support for:

*   **Jellyfin:** Your personal media server.
    *   Browse library & play media directly in Capsule (Basic player initially).
*   **The \*arr Stack:**
    *   **Sonarr:** TV Show management.
    *   *(More \*arrs like Radarr, Prowlarr, etc., coming soon!)*

*More applications will be added regularly! Check our roadmap.*

---

## 🗺️ Roadmap (Upcoming Features)

*   [ ] Full Jellyfin library browsing and enhanced media player.
*   [ ] Deeper integration with *arr stack (Radarr, Prowlarr, etc. - view download queue, add new media).
*   [ ] User authentication for Capsule access.
*   [ ] One-click updates for managed applications.
*   [ ] Backup and restore functionality for Capsule's configuration.
*   [ ] More app templates! (Nextcloud, Pi-hole, AdGuard Home, etc.)
*   [ ] Advanced container options in wizards (networks, resource limits).

---

## 🤝 Contributing

We welcome contributions! Whether it's feature requests, bug reports, documentation improvements, or code contributions, please feel free to:

1.  Open an issue on GitHub.
2.  Fork the repository and submit a pull request.

*(A `CONTRIBUTING.md` file with more details will be added soon.)*

---

## 🐞 Reporting Issues

If you find a bug or have a problem, please [open an issue](https://github.com/ManuSharma1991/capsule/issues) on GitHub. Provide as much detail as possible, including steps to reproduce, logs, and your environment.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---
Made with ❤️ by [Manu Sharma](https://github.com/ManuSharma1991)
