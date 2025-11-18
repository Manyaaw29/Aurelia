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
        });