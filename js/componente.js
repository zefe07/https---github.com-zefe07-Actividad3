

class PopModal {
  
  constructor(options = {}) {
    this.options = Object.assign(
      {
        title: "",
        content: "",
        buttons: [],
        maxWidth: "480px",
        closeOnOverlay: true,
        closeOnEsc: true,
        onOpen: null,
        onClose: null,
      },
      options
    );

    this._id = "popmodal-" + Math.random().toString(36).slice(2, 9);
    this._buildDOM();
    this._bindEvents();
  }

  _buildDOM() {
    const overlay = document.createElement("div");
    overlay.className = "popmodal-overlay";
    overlay.id = this._id;

    const box = document.createElement("div");
    box.className = "popmodal-box";
    box.style.setProperty("--popmodal-max-width", this.options.maxWidth);

   
    const header = document.createElement("div");
    header.className = "popmodal-header";
    header.innerHTML = `
      <h3 class="popmodal-title">${this.options.title}</h3>
      <button type="button" class="popmodal-close" aria-label="Cerrar">&times;</button>
    `;

  
    const body = document.createElement("div");
    body.className = "popmodal-body";
    body.innerHTML = this.options.content;

    box.appendChild(header);
    box.appendChild(body);


    if (this.options.buttons.length > 0) {
      const footer = document.createElement("div");
      footer.className = "popmodal-footer";

      this.options.buttons.forEach((btnConfig) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = `popmodal-btn popmodal-btn--${btnConfig.type || "secondary"}`;
        btn.textContent = btnConfig.text || "Aceptar";
        btn.addEventListener("click", () => {
          if (typeof btnConfig.onClick === "function") {
            btnConfig.onClick(this);
          }
        });
        footer.appendChild(btn);
      });

      box.appendChild(footer);
    }

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    this.overlayEl = overlay;
    this.boxEl = box;
    this.closeBtnEl = header.querySelector(".popmodal-close");
  }

  _bindEvents() {
    this.closeBtnEl.addEventListener("click", () => this.close());

    if (this.options.closeOnOverlay) {
      this.overlayEl.addEventListener("click", (e) => {
        if (e.target === this.overlayEl) this.close();
      });
    }

    if (this.options.closeOnEsc) {
      this._escHandler = (e) => {
        if (e.key === "Escape" && this.overlayEl.classList.contains("is-open")) {
          this.close();
        }
      };
      document.addEventListener("keydown", this._escHandler);
    }
  }

  open() {
    this.overlayEl.classList.add("is-open");
    document.body.style.overflow = "hidden";
    if (typeof this.options.onOpen === "function") this.options.onOpen(this);
    return this;
  }

  close() {
    this.overlayEl.classList.remove("is-open");
    document.body.style.overflow = "";
    if (typeof this.options.onClose === "function") this.options.onClose(this);
    return this;
  }

  setContent(html) {
    this.boxEl.querySelector(".popmodal-body").innerHTML = html;
    return this;
  }


  destroy() {
    if (this._escHandler) document.removeEventListener("keydown", this._escHandler);
    this.overlayEl.remove();
  }
}

PopModal.create = function (options) {
  return new PopModal(options);
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = PopModal;
}