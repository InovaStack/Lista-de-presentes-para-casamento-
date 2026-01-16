// Loading Screen Logic
window.addEventListener('DOMContentLoaded', () => {
  const loadingScreen = document.getElementById('loading-screen');
  const appContainer = document.getElementById('app');

  // Hide loading after a brief moment
  setTimeout(() => {
    if (loadingScreen) {
      loadingScreen.classList.add('fade-out');
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 500);
    }
    if (appContainer) {
      appContainer.classList.remove('hidden');
    }
  }, 1500); // Show loading for 1.5 seconds
});

// Gift Selection Logic
let selectedGift = null;
const giftModal = document.getElementById('gift-modal');

// Attach to window to ensure global access (fixes deployment/scoping issues)
window.openGiftModal = function (cardElement) {
  // Get data
  const id = cardElement.getAttribute('data-id');
  const name = cardElement.getAttribute('data-name');
  const img = cardElement.getAttribute('data-img');
  const isChosen = cardElement.classList.contains('gift-chosen');

  selectedGift = { id, name, img, isRepeat: isChosen };

  // Populate Modal
  const modalImg = document.getElementById('modal-img');
  const modalName = document.getElementById('modal-gift-name');
  const modalSubtitle = document.getElementById('modal-subtitle');

  // Se o presente já foi escolhido, mostra a imagem embrulhada e mensagem especial
  if (isChosen) {
    if (modalImg) modalImg.src = 'assets/img/gift_wrapped.png';
    if (modalName) modalName.textContent = name;
    if (modalSubtitle) {
      modalSubtitle.textContent = '✨ Este presente já foi escolhido! Mas você pode presentear novamente.';
      modalSubtitle.style.color = 'var(--primary-olive)';
      modalSubtitle.style.fontWeight = '500';
    }
  } else {
    if (modalImg) modalImg.src = img;
    if (modalName) modalName.textContent = name;
    if (modalSubtitle) {
      modalSubtitle.textContent = '';
    }
  }

  // Clear inputs
  const nameInput = document.getElementById('padrinhos-names');
  const msgInput = document.getElementById('message');

  if (nameInput) nameInput.value = '';
  if (msgInput) msgInput.value = '';

  // Show Modal
  if (giftModal) {
    giftModal.classList.remove('hidden');
    // Ensure display is block or flex if purely hidden class isn't enough (though CSS handles it)
  }
}

window.closeGiftModal = function () {
  if (giftModal) {
    giftModal.classList.add('hidden');
  }
  selectedGift = null;
}

// Close modal if clicked outside content
if (giftModal) {
  giftModal.addEventListener('click', (e) => {
    if (e.target === giftModal) {
      window.closeGiftModal();
    }
  });
}

window.confirmGift = function (event) {
  window.confirmarPresente(event);
}

window.confirmarPresente = function (event) {
  event.preventDefault();

  if (!selectedGift) return;

  const namesField = document.getElementById('padrinhos-names');
  const messageField = document.getElementById('message');

  const names = namesField ? namesField.value.trim() : '';
  const message = messageField ? messageField.value.trim() : '';

  if (!names) {
    alert("Por favor, digite o nome dos padrinhos.");
    return;
  }

  // Construct WhatsApp Message
  let text = `Olá! Somos os padrinhos *${names}*.\n\n`;

  // Se for repetição, adiciona informação na mensagem
  if (selectedGift.isRepeat) {
    text += `Também queremos presentear vocês com: *${selectedGift.name}* 🎁🎁\n`;
    text += `_(Este presente está sendo presenteado mais de uma vez)_\n`;
  } else {
    text += `Escolhemos presentear vocês com: *${selectedGift.name}* 🎁\n`;
  }

  if (message) {
    text += `\nMensagem Carinhosa: "${message}"`;
  }

  const whatsappUrl = `https://wa.me/5581989559729?text=${encodeURIComponent(text)}`;

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
      // Add visual indicator class (mantém clicável para repetições)
      giftCard.classList.add('gift-chosen');

      // Update the "Presentear" overlay text
      const overlayText = giftCard.querySelector('.overlay');
      if (overlayText) {
        overlayText.innerHTML = '<i class="fas fa-check"></i> Escolhido';
      }
    }
  }

  // Close and Confirm visual feedback
  window.closeGiftModal();
}
