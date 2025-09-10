import PanoramaViewer from '../components/PanoramaViewer';

export default function MonasteryTourPage() {
    // Replace this URL with the path to your 360° image file.
    // It should be located in your project's `public` folder.
    const tourImage = "/images/your-360-image.jpg"; 
    
    return (
        <main>
            <h1>Monastery Virtual Tour</h1>
            <p>Welcome to our immersive 360-degree tour!</p>
            
            {/* The PanoramaViewer is the client component that renders the tour */}
            <PanoramaViewer imagePath={tourImage} />
        </main>
    );
}
