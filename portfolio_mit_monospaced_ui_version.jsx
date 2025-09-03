import React from "react";

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">My Portfolio</h1>
        <p className="text-gray-600">A showcase of my work and skills</p>
      </header>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">About Me</h2>
        <p className="text-gray-700 leading-relaxed">
          I am a developer passionate about building clean and efficient web applications.
          This portfolio highlights my projects and skills.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Projects</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow p-4">
            <h3 className="text-xl font-bold mb-2">Project One</h3>
            <p className="text-gray-600">A web app built with React and Tailwind.</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-4">
            <h3 className="text-xl font-bold mb-2">Project Two</h3>
            <p className="text-gray-600">An API integration project with Node.js.</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-4">
            <h3 className="text-xl font-bold mb-2">Project Three</h3>
            <p className="text-gray-600">A responsive portfolio using React.</p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Skills</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>React.js</li>
          <li>Node.js</li>
          <li>Tailwind CSS</li>
          <li>REST APIs</li>
        </ul>
      </section>

      <footer className="text-center text-gray-500 mt-12">
        <p>© {new Date().getFullYear()} My Portfolio</p>
      </footer>
    </div>
  );
}
