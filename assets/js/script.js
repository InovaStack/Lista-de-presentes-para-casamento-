

// Gift Selection Logic
let selectedGift = null;
const giftModal = document.getElementById('gift-modal');

function openGiftModal(cardElement) {
  // Get data
  const id = cardElement.getAttribute('data-id');
  const name = cardElement.getAttribute('data-name');
  const img = cardElement.getAttribute('data-img');

  selectedGift = { id, name, img };

  // Populate Modal
  document.getElementById('modal-img').src = img;
  document.getElementById('modal-gift-name').textContent = name;

  // Clear inputs
  document.getElementById('padrinhos-names').value = '';
  document.getElementById('message').value = '';

  // Show Modal
  giftModal.classList.remove('hidden');
}

function closeGiftModal() {
  giftModal.classList.add('hidden');
  selectedGift = null;
}

// Close modal if clicked outside content
giftModal.addEventListener('click', (e) => {
  if (e.target === giftModal) {
    closeGiftModal();
  }
});

function confirmGift(event) {
  confirmarPresente(event);
}

function confirmarPresente(event) {
  event.preventDefault();

  if (!selectedGift) return;

  const names = document.getElementById('padrinhos-names').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!names) {
    alert("Por favor, digite o nome dos padrinhos.");
    return;
  }

  // Construct WhatsApp Message
  let text = `Olá! Somos os padrinhos *${names}*.\n`;
  text += `Escolhemos presentear vocês com: *${selectedGift.name}* 🎁\n`;
  if (message) {
    text += `\nMensagem Carinhosa: "${message}"`;
  }

  const whatsappUrl = `https://wa.me/558191827280?text=${encodeURIComponent(text)}`;

  // Open WhatsApp
  window.open(whatsappUrl, '_blank');

  // Update the gift card image to "Wrapped Gift" visually
  if (selectedGift && selectedGift.id) {
    const giftCard = document.querySelector(`.gift-card[data-id="${selectedGift.id}"]`);
    if (giftCard) {
      const img = giftCard.querySelector('img');
      if (img) {
        img.src = 'assets/img/gift_wrapped.png'; // Change to wrapped gift image
        img.alt = 'Presente Escolhido';
      }
      // Optional: Add a visual indicator class
      giftCard.classList.add('gift-chosen');

      // Update the "Presentear" overlay text
      const overlayText = giftCard.querySelector('.overlay');
      if (overlayText) {
        overlayText.innerHTML = '<i class="fas fa-check"></i> Escolhido';
      }
    }
  }

  // Close and Confirm visual feedback
  closeGiftModal();
}
