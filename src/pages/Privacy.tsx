import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to Gallery
            </Button>
          </Link>
        </div>

        <ScrollArea className="h-[calc(100vh-120px)] pr-4">
          <div className="prose dark:prose-invert max-w-none">
            <h1>Privacy Policy</h1>
            
            <p className="text-lg text-muted-foreground mb-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2>Introduction</h2>
              <p>
                Bookmark Gallery ("we", "our", or "us") is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, and safeguard your information 
                when you use our Chrome extension.
              </p>
            </section>

            <section className="mb-8">
              <h2>Information We Collect</h2>
              <p>
                Our extension only accesses and processes your Chrome bookmarks locally on your device. 
                We collect:
              </p>
              <ul>
                <li>Bookmark data (titles, URLs, and folder structure)</li>
                <li>Extension preferences and settings</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2>How We Use Your Information</h2>
              <p>
                The information we collect is used solely to:
              </p>
              <ul>
                <li>Display your bookmarks in a gallery view</li>
                <li>Enable bookmark organization and management</li>
                <li>Save your extension preferences</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2>Data Storage</h2>
              <p>
                All data is stored locally on your device using Chrome's storage API. 
                We do not transmit or store any of your data on external servers.
              </p>
            </section>

            <section className="mb-8">
              <h2>Third-Party Access</h2>
              <p>
                We do not share your data with any third parties. Your bookmarks 
                remain private and are only accessible through your Chrome browser.
              </p>
            </section>

            <section className="mb-8">
              <h2>Your Rights</h2>
              <p>
                You have the right to:
              </p>
              <ul>
                <li>Access your bookmark data at any time</li>
                <li>Modify or delete your bookmarks</li>
                <li>Uninstall the extension and remove all associated data</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2>Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify 
                you of any changes by posting the new Privacy Policy on this page.
              </p>
            </section>

            <section className="mb-8">
              <h2>Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
                <br />
                <a href="mailto:support@bookmarkgallery.app" className="text-primary">
                  support@bookmarkgallery.app
                </a>
              </p>
            </section>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Privacy;