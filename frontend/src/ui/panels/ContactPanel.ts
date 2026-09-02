export function renderContact(): string {
  return `
    <h3 class="panel-title">Contacto</h3>
    <p style="color:#aaa;font-size:.82rem;margin-bottom:1rem;">
      ¿Tienes un proyecto interesante o quieres hablar? Escríbeme.
    </p>
    <form
      class="contact-form"
      name="contact"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      id="contact-form"
    >
      <input type="hidden" name="form-name" value="contact" />
      <p style="display:none;"><input name="bot-field" /></p>

      <div>
        <label for="cf-name">Nombre</label>
        <input id="cf-name" type="text" name="name" required maxlength="100"
               autocomplete="name" placeholder="Tu nombre" />
      </div>
      <div>
        <label for="cf-email">Email</label>
        <input id="cf-email" type="email" name="email" required maxlength="254"
               autocomplete="email" placeholder="tu@email.com" />
      </div>
      <div>
        <label for="cf-msg">Mensaje</label>
        <textarea id="cf-msg" name="message" required maxlength="2000"
                  placeholder="Tu mensaje..."></textarea>
      </div>
      <button type="submit">Enviar</button>
      <div class="form-status" id="form-status" style="display:none;"></div>
    </form>
  `;
}

export function attachContactFormHandler(): void {
  const form   = document.getElementById('contact-form') as HTMLFormElement | null;
  const status = document.getElementById('form-status')  as HTMLElement | null;
  if (!form || !status) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    try {
      const res = await fetch('/', { method: 'POST', body: data });
      if (res.ok) {
        status.className = 'form-status success';
        status.textContent = '✔ Mensaje enviado. ¡Gracias!';
        status.style.display = 'block';
        form.reset();
      } else {
        throw new Error(`${res.status}`);
      }
    } catch {
      status.className = 'form-status error';
      status.textContent = '✘ Error al enviar. Inténtalo de nuevo.';
      status.style.display = 'block';
    }
  });
}
