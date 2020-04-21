using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Diagnostics;
using TelerikNPMResources.Models;

namespace TelerikNPMResources.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult CDN()
        {
            return View("CDN");
        }

        public IActionResult Local()
        {
            return View("Local");
        }
    }
}
