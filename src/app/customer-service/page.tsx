'use client';

import { useState } from 'react';
import { Mail, Phone, MessageCircle, HelpCircle, PlusCircle, MinusCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const FAQS = [
  {
    question: 'How do I track my order?',
    answer: 'You can track your order by logging into your account and visiting the "Orders" section. Alternatively, you can use the tracking number provided in your shipping confirmation email.'
  },
  {
    question: 'What is your return policy?',
    answer: 'We accept returns within 30 days of delivery for most items. Products must be in their original condition with all tags and packaging. Please note that some items like personalized products cannot be returned.'
  },
  {
    question: 'When will I receive my refund?',
    answer: 'Refunds are typically processed within 5-7 business days after we receive your returned item. The time it takes for the refund to appear in your account depends on your payment method and financial institution.'
  },
  {
    question: 'Do you ship internationally?',
    answer: 'Yes, we ship to most countries worldwide. International shipping times and costs vary depending on the destination. You can see the shipping options available during checkout.'
  },
  {
    question: 'How can I change or cancel my order?',
    answer: 'You can request changes or cancellations within 1 hour of placing your order by contacting our customer service team. After this time, we may have already begun processing your order and changes might not be possible.'
  },
  {
    question: 'Are my payment details secure?',
    answer: 'Yes, we use industry-standard encryption and security protocols to protect your payment information. We never store your complete credit card details on our servers.'
  }
];

type ContactFormData = {
  name: string;
  email: string;
  message: string;
  subject: string;
};

export default function CustomerServicePage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const toggleFaq = (index: number) => {
    if (openFaqIndex === index) {
      setOpenFaqIndex(null);
    } else {
      setOpenFaqIndex(index);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    
    // Show success toast
    toast.success('Your message has been sent successfully. We will contact you soon!');
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="container mx-auto py-10">
      <header className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-3">Customer Service</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          We're here to help! Browse through our FAQs or contact our support team with any questions or concerns.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        <section>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <HelpCircle className="mr-2 h-5 w-5 text-purple-600" />
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-4">
              {FAQS.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    className={`flex justify-between items-center w-full p-4 text-left font-medium text-gray-900 ${
                      openFaqIndex === index ? 'bg-purple-50' : ''
                    }`}
                    onClick={() => toggleFaq(index)}
                  >
                    <span>{faq.question}</span>
                    {openFaqIndex === index ? (
                      <MinusCircle className="h-5 w-5 text-purple-600" />
                    ) : (
                      <PlusCircle className="h-5 w-5 text-purple-600" />
                    )}
                  </button>
                  
                  {openFaqIndex === index && (
                    <div className="p-4 bg-gray-50 border-t border-gray-200">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <MessageCircle className="mr-2 h-5 w-5 text-purple-600" />
              Contact Us
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="john@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  placeholder="Order Issue, Product Question, etc."
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  placeholder="Please describe your issue or question in detail..."
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>
              
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </form>
          </div>
        </section>
      </div>

      <section className="bg-purple-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Other Ways To Reach Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-5 flex items-start shadow-sm">
            <Phone className="h-5 w-5 text-purple-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <div className="font-medium">Call Us</div>
              <p className="text-gray-600 text-sm mb-2">Available Monday-Friday, 9 AM - 6 PM</p>
              <a href="tel:+918001234567" className="text-purple-600 font-medium">+91 800 123 4567</a>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-5 flex items-start shadow-sm">
            <Mail className="h-5 w-5 text-purple-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <div className="font-medium">Email Support</div>
              <p className="text-gray-600 text-sm mb-2">We'll respond within 24 hours</p>
              <a href="mailto:support@mystore.com" className="text-purple-600 font-medium">support@mystore.com</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 