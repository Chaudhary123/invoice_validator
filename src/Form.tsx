import { useState } from 'react';
import type { ChangeEvent, MouseEvent } from 'react';

interface FormData {
  selectOption: 'quickBook' | 'salesForce';
  alphanumericCode: string;
}

export default function Form() {
  const [formData, setFormData] = useState<FormData>({
    selectOption: 'quickBook',
    alphanumericCode: ''
  });

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, selectOption: e.target.value as 'quickBook' | 'salesForce' });
  };

  const handleCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, alphanumericCode: e.target.value });
  };

  const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert(`Selected: ${formData.selectOption}\nCode: ${formData.alphanumericCode}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-gray-400 rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Find the Invoice</h2>
        
        <div className="space-y-6">
          {/* Select Field */}
          <div>
            <label htmlFor="select" className="block text-sm font-medium text-gray-700 mb-2">
              Please Select the Organization
            </label>
            <select
              id="select"
              value={formData.selectOption}
              onChange={handleSelectChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            >
              <option value="quickBook">QuickBook</option>
              <option value="salesForce">SalesForce</option>
            </select>
          </div>

          {/* Alphanumeric Code Field */}
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
              Invoice Id
            </label>
            <input
              type="text"
              id="code"
              value={formData.alphanumericCode}
              onChange={handleCodeChange}
              placeholder="Enter code (e.g., INV123)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition font-medium"
          >
            Search
          </button>
        </div>

        {/* Display Current Values */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Selected:</strong> {formData.selectOption}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Code:</strong> {formData.alphanumericCode || 'Not entered'}
          </p>
        </div>
      </div>
    </div>
  );
}