document.addEventListener('DOMContentLoaded', () => {
    const options = document.querySelectorAll('.period-option');
    const totalValue = document.getElementById('totalValue');

    function updateRenewal() {
        options.forEach(option => {
            const radio = option.querySelector('input[type="radio"]');
            option.classList.toggle('selected', radio.checked);
        });

        const selected = document.querySelector('input[name="periodo"]:checked');
        if (selected && totalValue) {
            const value = Number(selected.value);
            totalValue.textContent = value.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });
        }
    }

    options.forEach(option => {
        const radio = option.querySelector('input[type="radio"]');
        radio.addEventListener('change', updateRenewal);
        option.addEventListener('click', event => {
            if (event.target !== radio) {
                radio.checked = true;
                updateRenewal();
            }
        });
    });

    updateRenewal();
});
