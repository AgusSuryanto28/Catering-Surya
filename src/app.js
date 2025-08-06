document.addEventListener("alpine:init", () => {
  Alpine.data("products", () => ({
    items: [
      { id: 1, name: "Ayam Geprek", img: "Geprek.jpg", price: 30000 },
      { id: 2, name: "Chiken Katsu", img: "Katsu.jpg", price: 30000 },
      { id: 3, name: "Ayam Teriyaki", img: "Teriyaki.jpg", price: 30000 },
      { id: 4, name: "Risol Mayo", img: "Risol.jpg", price: 15000 },
      { id: 5, name: "Pudding", img: "Puding.jpg", price: 10000 },
    ],
  }));

  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,
    add(newItem) {
      // Cek Apakah Ada Barang Yang Sama Di Cart
      const cartItem = this.items.find((item) => item.id === newItem.id);

      // Jika Belum ada / cart masih kosong
      if (!cartItem) {
        this.items.push({ ...newItem, quantity: 1, total: newItem.price });
        this.quantity++;
        this.total += newItem.price;
      } else {
        // Jika barang sudah ada, cek apakah barang beda atau sama dengan yang ada di cart
        this.items = this.items.map((item) => {
          // Jika barang berbeda
          if (item.id !== newItem.id) {
            return item;
          } else {
            // jika barang sudah ada, tambah quantity dan totalnya
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += item.price;
            return item;
          }
        });
      }
    },
    remove(id) {
      // ambil item yang mau di remove berdasarkan id nya
      const cartItem = this.items.find((item) => item.id === id);

      // jika item lebih dari 1
      if (cartItem.quantity > 1) {
        // telusuri 1 1
        this.items = this.items.map((item) => {
          // jika bukan barang yang di klik
          if ((item, id !== id)) {
            return item;
          } else {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;
            return item;
          }
        });
      } else if (cartItem.quantity === 1) {
        // Jika barangnya sisa 1
        this.items = this.items.filter((item) => item.id != id);
        this.quantity--;
        this.total -= cartItem.price;
      }
    },
  });
});

// Form Validation checkout
const checkoutButton = document.querySelector(".checkout-button");
checkoutButton.disabled = true;

const form = document.querySelector("#checkoutForm");

form.addEventListener("keyup", function () {
  for (let i = 0; i < form.elements.length; i++) {
    if (form.elements[i].value.length !== 0) {
      checkoutButton.classList.remove("disabled");
      checkoutButton.classList.add("disabled");
    } else {
      return false;
    }
  }
  checkoutButton.disabled = false;
  checkoutButton.classList.remove("disabled");
});

// Kirim Data Ketika tombol checkout di klik
checkoutButton.addEventListener("click", function (e) {
  e.preventDefault();
  const formData = new FormData(form);
  const data = new URLSearchParams(formData);
  const objData = Object.fromEntries(data);
  const message = formatMessage(objData);
  window.open(
    "https://wa.me/6285939805204?text=" + encodeURIComponent(message)
  );
});

// Format Pesan WhatsApp checkout
const formatMessage = (obj) => {
  return `Data Customer
    Nama: ${obj.name}
    email: ${obj.email}
    No HP: ${obj.phone}
Data Pesanan
  ${JSON.parse(obj.items).map(
    (item) => `${item.name} (${item.quantity} x ${rupiah(item.total)}) \n`
  )}
TOTAL: ${rupiah(obj.total)}
Terima Kasih.`;
};

// Form Validation Support
const supportButton = document.querySelector(".support-button");
supportButton.disabled = true;

const formS = document.querySelector("#supportForm");

formS.addEventListener("keyup", function () {
  for (let i = 0; i < formS.elements.length; i++) {
    if (formS.elements[i].value.length !== 0) {
      supportButton.classList.remove("disabled");
      supportButton.classList.add("disabled");
    } else {
      return false;
    }
  }
  supportButton.disabled = false;
  supportButton.classList.remove("disabled");
});

// kirim Customer Service
supportButton.addEventListener("click", function (e) {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const nomor = document.getElementById("nomor").value;
  const message = document.getElementById("message").value;

  const encodedText =
    "Hallo Admin%0A" +
    "Nama: *" +
    encodeURIComponent(name) +
    "*%0A" +
    "Email: *" +
    encodeURIComponent(email) +
    "*%0A" +
    "Phone: *" +
    encodeURIComponent(nomor) +
    "*%0A" +
    "Pesan: *" +
    encodeURIComponent(message) +
    "*";

  const whatsappURL = `https://wa.me/6281952423201?text=${encodedText}`;

  window.open(whatsappURL);
});

// Konversi ke Rupiah
const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};
