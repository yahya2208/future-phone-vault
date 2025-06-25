
import UIKit
import Capacitor

class ViewController: CAPBridgeViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Set the background color
        view.backgroundColor = UIColor.white
        
        // Configure the status bar
        if #available(iOS 13.0, *) {
            overrideUserInterfaceStyle = .light
        }
    }

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        
        // Additional setup after view appears
        if let webView = self.webView {
            webView.backgroundColor = UIColor.white
            webView.scrollView.backgroundColor = UIColor.white
            webView.isOpaque = false
            webView.scrollView.bounces = false
            webView.scrollView.isScrollEnabled = true
        }
    }
}
