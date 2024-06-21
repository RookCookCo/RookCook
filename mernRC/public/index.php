<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RookCook</title>
    <link rel="stylesheet" href="styles.css"> <!-- Link to external CSS file -->
</head>
<body>
    <header>
        <h1>Welcome to RookCook!</h1>
    </header>
    <main>
        <section>
            <h2>About Me</h2>
            <p><?php echo "This was Nicole's Idea so she should do all the work. Thank You :D"; ?></p>
        </section>
        <section>
            <h2>Latest Updates</h2>
            <ul id="updates">
                <!-- PHP can dynamically generate list items here -->
                <?php
                // Example of dynamic content generation with PHP
                $updates = [
                    "Website launched!",
                    "Added new content",
                    "Fixed bugs"
                ];
                foreach ($updates as $update) {
                    echo "<li>$update</li>";
                }
                ?>
            </ul>
        </section>
    </main>
    <footer>
        <p>&copy; <?php echo date('Y'); ?> Your Name</p>
    </footer>
    
    <!-- JavaScript file inclusion -->
    <script src="script.js"></script>
</body>
</html>
