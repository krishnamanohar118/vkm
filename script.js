// Billing System JavaScript
class BillingSystem {
    constructor() {
        this.services = {
            consultation: 100,
            labTest: 250,
            xray: 300,
            medication: 150,
            therapy: 200
        };
        this.taxes = 0.15; // 15% tax
        this.discount = 0.1; // 10% discount for seniors
    }

    calculateBill(services, isInsured = false, isSenior = false) {
        let totalAmount = 0;
        let breakdown = {};

        // Calculate services total
        services.forEach(service => {
            if (this.services[service]) {
                totalAmount += this.services[service];
                breakdown[service] = this.services[service];
            }
        });

        // Apply insurance discount if applicable
        if (isInsured) {
            const insuranceDiscount = totalAmount * 0.3; // 30% insurance coverage
            totalAmount -= insuranceDiscount;
            breakdown.insuranceDiscount = -insuranceDiscount;
        }

        // Apply senior citizen discount if applicable
        if (isSenior) {
            const seniorDiscount = totalAmount * this.discount;
            totalAmount -= seniorDiscount;
            breakdown.seniorDiscount = -seniorDiscount;
        }

        // Add taxes
        const taxAmount = totalAmount * this.taxes;
        totalAmount += taxAmount;
        breakdown.taxes = taxAmount;

        return {
            subtotal: totalAmount - taxAmount,
            taxes: taxAmount,
            total: totalAmount,
            breakdown: breakdown
        };
    }

    generateBillHTML(billDetails, patientName, billDate) {
        return `
            <div class="bill-container p-8 bg-white rounded-lg shadow-xl max-w-2xl mx-auto">
                <div class="text-center mb-6">
                    <h2 class="text-2xl font-bold text-gray-800">Medical Bill</h2>
                    <p class="text-gray-600">Date: ${billDate}</p>
                    <p class="text-gray-600">Patient: ${patientName}</p>
                </div>

                <div class="border-t border-b py-4 my-4">
                    <h3 class="font-semibold mb-3">Services Breakdown:</h3>
                    ${Object.entries(billDetails.breakdown)
                        .map(([key, value]) => `
                            <div class="flex justify-between mb-2">
                                <span class="capitalize">${key}</span>
                                <span>$${Math.abs(value).toFixed(2)}</span>
                            </div>
                        `).join('')}
                </div>

                <div class="mt-4">
                    <div class="flex justify-between font-semibold">
                        <span>Subtotal:</span>
                        <span>$${billDetails.subtotal.toFixed(2)}</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Taxes (15%):</span>
                        <span>$${billDetails.taxes.toFixed(2)}</span>
                    </div>
                    <div class="flex justify-between text-xl font-bold mt-4">
                        <span>Total:</span>
                        <span>$${billDetails.total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        `;
    }
}

// Example usage:
document.addEventListener('DOMContentLoaded', () => {
    const billingSystem = new BillingSystem();
    
    // Add event listener for bill generation form
    const billForm = document.getElementById('billForm');
    if (billForm) {
        billForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const selectedServices = Array.from(document.querySelectorAll('input[name="services"]:checked'))
                .map(input => input.value);
            
            const isInsured = document.getElementById('isInsured').checked;
            const isSenior = document.getElementById('isSenior').checked;
            const patientName = document.getElementById('patientName').value;
            
            const billDetails = billingSystem.calculateBill(selectedServices, isInsured, isSenior);
            const billHTML = billingSystem.generateBillHTML(
                billDetails,
                patientName,
                new Date().toLocaleDateString()
            );
            
            document.getElementById('billOutput').innerHTML = billHTML;
        });
    }
});

// Add interactive features
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Animate statistics on scroll
    const animateStats = () => {
        const stats = document.querySelectorAll('.statistics-card h3');
        stats.forEach(stat => {
            const value = parseInt(stat.textContent);
            let current = 0;
            const increment = value / 50;
            const updateCount = () => {
                if (current < value) {
                    current += increment;
                    stat.textContent = Math.ceil(current) + '+';
                    requestAnimationFrame(updateCount);
                } else {
                    stat.textContent = value + '+';
                }
            };
            updateCount();
        });
    };

    // Intersection Observer for statistics animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    });

    const statsSection = document.querySelector('.statistics-section');
    if (statsSection) observer.observe(statsSection);
});