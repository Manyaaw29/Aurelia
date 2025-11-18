// Wait for the HTML document to be fully loaded before running the script
        document.addEventListener('DOMContentLoaded', function () {

            // Find the buttons by their IDs
            const loadMoreButton = document.getElementById('load-more-btn');
            const loadLessButton = document.getElementById('load-less-btn'); // NEW ELEMENT

            // Find the news container by its class
            const hiddenNews = document.querySelector('.hidden-news');

            // Check if all elements were found
            if (loadMoreButton && loadLessButton && hiddenNews) {

                // Event listener for "Read More"
                loadMoreButton.addEventListener('click', function () {

                    // 1. Add the 'is-visible' class to the news container, which makes it appear via CSS
                    hiddenNews.classList.add('is-visible');

                    // 2. Hide the "Read More" button and show the "Read Less" button
                    loadMoreButton.style.display = 'none';
                    loadLessButton.style.display = 'inline-block'; // Show Read Less

                    // Optional: Scroll to the start of the hidden news section for better UX
                    hiddenNews.scrollIntoView({ behavior: 'smooth', block: 'start' });
                });

                // NEW Event listener for "Read Less"
                loadLessButton.addEventListener('click', function () {

                    // 1. Remove the 'is-visible' class to hide the news container via CSS
                    hiddenNews.classList.remove('is-visible');

                    // 2. Hide the "Read Less" button and show the "Read More" button
                    loadLessButton.style.display = 'none'; // Hide Read Less
                    loadMoreButton.style.display = 'inline-block'; // Show Read More

                    // Optional: Scroll back up to the section title
                    const sectionTitle = document.querySelector('.section-title');
                    if (sectionTitle) {
                        sectionTitle.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                });
            }

            // Make the 'Explore Our Ethos' button functional
            const ethosBtn = document.querySelector('.cta-btn[for="ethos-toggle"]');
            const ethosModal = document.getElementById('ethos-content');
            if (ethosBtn && ethosModal) {
                ethosBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    ethosModal.style.opacity = '1';
                    ethosModal.style.visibility = 'visible';
                    ethosModal.style.pointerEvents = 'all';
                });
            }

            // Close modal when clicking the close button
            const closeBtn = document.querySelector('.close-btn-label[for="ethos-toggle"]');
            if (closeBtn && ethosModal) {
                closeBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    ethosModal.style.opacity = '0';
                    ethosModal.style.visibility = 'hidden';
                    ethosModal.style.pointerEvents = 'none';
                });
            }

            // Make the 'Continue to Page' button close the modal and return to the about page content
            const continueBtn = document.querySelector('#ethos-content .cta-btn');
            const ethosModal2 = document.getElementById('ethos-content');
            if (continueBtn && ethosModal2) {
                continueBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    ethosModal2.style.opacity = '0';
                    ethosModal2.style.visibility = 'hidden';
                    ethosModal2.style.pointerEvents = 'none';
                });
            }
        });