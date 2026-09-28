# Contact Details & Online Presence

This document contains a comprehensive index of all contact details, social links, email service configurations, and domain references found across the **Adarsh-Portfolio** codebase.

---

## 1. Direct Contact Details

| Channel              | Detail                                                          | Source File(s)                                                                                                                                                                                                                                                                                                                                              |
| :------------------- | :-------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Full Name**        | Adarsh Parmar                                                   | [`src/components/Hero.tsx`](file:///Users/adarshparmar/Documents/Apps/MY%20APPS/Adarsh-Portfolio/src/components/Hero.tsx), [`src/components/Contact.tsx`](file:///Users/adarshparmar/Documents/Apps/MY%20APPS/Adarsh-Portfolio/src/components/Contact.tsx), [`index.html`](file:///Users/adarshparmar/Documents/Apps/MY%20APPS/Adarsh-Portfolio/index.html) |
| **Email Address**    | [adarshparmar.dev@gmail.com](mailto:adarshparmar.dev@gmail.com) | [`src/components/Contact.tsx`](file:///Users/adarshparmar/Documents/Apps/MY%20APPS/Adarsh-Portfolio/src/components/Contact.tsx#L284)<br>[`src/components/Hero.tsx`](file:///Users/adarshparmar/Documents/Apps/MY%20APPS/Adarsh-Portfolio/src/components/Hero.tsx#L333)<br>Git Configuration (`user.email`)                                                  |
| **Phone Number**     | `+91 9724397749`                                                | [`src/components/Contact.tsx`](file:///Users/adarshparmar/Documents/Apps/MY%20APPS/Adarsh-Portfolio/src/components/Contact.tsx#L287)                                                                                                                                                                                                                        |
| **Location Context** | Gujarat, India (+91)                                            | [`src/components/About.tsx`](file:///Users/adarshparmar/Documents/Apps/MY%20APPS/Adarsh-Portfolio/src/components/About.tsx#L159) _(Govt. Engineering College, Dahod)_                                                                                                                                                                                       |

---

## 2. Social Media & Professional Profiles

| Platform        | Handle / URL                                                                                   | Source File(s)                                                                                                                                                                                                                                                                                                                                                                |
| :-------------- | :--------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **LinkedIn**    | [linkedin.com/in/adarsh-parmar-161960288](https://www.linkedin.com/in/adarsh-parmar-161960288) | [`src/components/Contact.tsx`](file:///Users/adarshparmar/Documents/Apps/MY%20APPS/Adarsh-Portfolio/src/components/Contact.tsx#L291)<br>[`src/components/Hero.tsx`](file:///Users/adarshparmar/Documents/Apps/MY%20APPS/Adarsh-Portfolio/src/components/Hero.tsx#L331)<br>[`index.html`](file:///Users/adarshparmar/Documents/Apps/MY%20APPS/Adarsh-Portfolio/index.html#L73) |
| **GitHub**      | [github.com/adarsh25-dev](https://github.com/adarsh25-dev)                                     | [`src/components/Contact.tsx`](file:///Users/adarshparmar/Documents/Apps/MY%20APPS/Adarsh-Portfolio/src/components/Contact.tsx#L296)<br>[`src/components/Hero.tsx`](file:///Users/adarshparmar/Documents/Apps/MY%20APPS/Adarsh-Portfolio/src/components/Hero.tsx#L328)<br>Git Remote Origin                                                                                   |
| **Twitter / X** | [@adarshparmar](https://twitter.com/adarshparmar)                                              | [`index.html`](file:///Users/adarshparmar/Documents/Apps/MY%20APPS/Adarsh-Portfolio/index.html#L66-L67)                                                                                                                                                                                                                                                                       |

---

## 3. Web & Domain Details

| Asset                    | URL                                                                                                                            | Source File(s)                                                                                                                                                                                                                                                |
| :----------------------- | :----------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Portfolio Website**    | [https://adarshparmar.dev/](https://adarshparmar.dev/)                                                                         | [`index.html`](file:///Users/adarshparmar/Documents/Apps/MY%20APPS/Adarsh-Portfolio/index.html#L25)<br>[`src/components/PreviewGenerator.tsx`](file:///Users/adarshparmar/Documents/Apps/MY%20APPS/Adarsh-Portfolio/src/components/PreviewGenerator.tsx#L221) |
| **Social Preview Image** | [https://adarshparmar.dev/preview-image.jpg](https://adarshparmar.dev/preview-image.jpg)                                       | [`index.html`](file:///Users/adarshparmar/Documents/Apps/MY%20APPS/Adarsh-Portfolio/index.html#L36)                                                                                                                                                           |
| **Lovable Project URL**  | [lovable.dev/projects/7d0fd1c1-0731-4412-a154-a4f41cd1f77e](https://lovable.dev/projects/7d0fd1c1-0731-4412-a154-a4f41cd1f77e) | [`README.md`](file:///Users/adarshparmar/Documents/Apps/MY%20APPS/Adarsh-Portfolio/README.md#L5)                                                                                                                                                              |

---

## 4. Contact Form Integration (EmailJS)

The contact form in [`Contact.tsx`](file:///Users/adarshparmar/Documents/Apps/MY%20APPS/Adarsh-Portfolio/src/components/Contact.tsx) dispatches incoming messages using **EmailJS**:

| Parameter          | Configuration Key / Value                       | Source File(s)                                                                                                                      |
| :----------------- | :---------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------- |
| **Public Key**     | `3-WysGlmvCzoPLEe7` (`VITE_EMAILJS_PUBLIC_KEY`) | [`.env`](file:///Users/adarshparmar/Documents/Apps/MY%20APPS/Adarsh-Portfolio/.env#L2)                                              |
| **Service ID**     | `service_s5wdxcs1` (`VITE_EMAILJS_SERVICE_ID`)  | [`.env`](file:///Users/adarshparmar/Documents/Apps/MY%20APPS/Adarsh-Portfolio/.env#L3)                                              |
| **Template ID**    | `template_szkt8l4` (`VITE_EMAILJS_TEMPLATE_ID`) | [`.env`](file:///Users/adarshparmar/Documents/Apps/MY%20APPS/Adarsh-Portfolio/.env#L4)                                              |
| **Recipient Name** | `"Adarsh Parmar"` (`to_name`)                   | [`src/components/Contact.tsx`](file:///Users/adarshparmar/Documents/Apps/MY%20APPS/Adarsh-Portfolio/src/components/Contact.tsx#L49) |

---

## 5. Associated Project Links

| Project         | Repository / Live Demo Link                                                                             | Source File(s)                                                                                                                              |
| :-------------- | :------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------ |
| **ClientOS**    | [GitHub Repo](https://github.com/adarsh25-dev/ClientOS) · [Live Demo](https://clientos-vue.vercel.app/) | [`src/components/Projects.tsx`](file:///Users/adarshparmar/Documents/Apps/MY%20APPS/Adarsh-Portfolio/src/components/Projects.tsx#L144-L145) |
| **LaunchForge** | [GitHub Repo & Demo](https://github.com/adarsh25-dev/LaunchForge)                                       | [`src/components/Projects.tsx`](file:///Users/adarshparmar/Documents/Apps/MY%20APPS/Adarsh-Portfolio/src/components/Projects.tsx#L158-L159) |
| **Lumina RAG**  | [GitHub Repo & Demo](https://github.com/adarsh25-dev/Lumina-RAG)                                        | [`src/components/Projects.tsx`](file:///Users/adarshparmar/Documents/Apps/MY%20APPS/Adarsh-Portfolio/src/components/Projects.tsx#L172-L173) |
| **SuperReach**  | [Live Site](https://superreach.com/)                                                                    | [`src/components/Projects.tsx`](file:///Users/adarshparmar/Documents/Apps/MY%20APPS/Adarsh-Portfolio/src/components/Projects.tsx#L131)      |
