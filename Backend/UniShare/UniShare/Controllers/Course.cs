﻿    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using Minio;
    using Minio.DataModel.Args;
    using Npgsql.Replication.PgOutput.Messages;
    using System.IdentityModel.Tokens.Jwt;
    using UniShare.Database;
    using UniShare.Dto.CourseDto;
    using UniShare.Models;

    namespace UniShare.Controllers
    {
        [Route("api/[controller]")]
        [ApiController]
        public class Course : ControllerBase
        {
            private readonly AppDbContext _appDbContext;
            private readonly IMinioClient _minioClient;

            public Course(AppDbContext appDbContext, IMinioClient minioClient)
            {
                _appDbContext = appDbContext;
                _minioClient = minioClient;
            }

            [HttpPost("CourseCreate")]
            public async Task<IActionResult> Create(CreateCourse courseRequest)
            {
                var course = new CourseModel
                {
                    Name = courseRequest.Name,
                    Description = courseRequest.Description,
                    Category = courseRequest.Category
                };

                var userIdClaim = this.User.Claims.FirstOrDefault(x => x.Type == "UserId");

                if (userIdClaim != null && int.TryParse(userIdClaim.Value, out int userId))
                {
                    course.UserId = userId;
                }
                else
                {
                    return BadRequest("User ID-ul was not found.");
                }


                var courseExist = await _appDbContext.Courses.AnyAsync(x => x.Name == courseRequest.Name && x.Id == course.UserId);

                if (courseExist)
                {
                    return BadRequest("The course already was created");
                }

                await _appDbContext.Courses.AddAsync(course);
                await _appDbContext.SaveChangesAsync();

                return Ok(course);

            }
        

            [HttpPost("CreateMaterial")]

            public async Task<IActionResult> Create(IFormFile file, int courseId)
            {
                var course = await _appDbContext.Courses.FirstOrDefaultAsync(x => x.Id == courseId);
                if (course == null)
                {
                    return NotFound("The course not founded");
                }
                string bucketName = course.Category == 0 ? "programming" : "mathematics";

                var material = new MaterialModel
                {
                    FileName = file.FileName,
                    Bucket = bucketName,
                    CourseId = courseId,
                };


                using (Stream stream = new MemoryStream())
                {
                    await file.CopyToAsync(stream);
                    stream.Position = 0;

                    try
                    {

                        PutObjectArgs putObjectArgs = new PutObjectArgs()
                                                        .WithBucket(bucketName)
                                                        .WithObject(file.FileName)
                                                        .WithContentType(file.ContentType)
                                                        .WithObjectSize(stream.Length)
                                                        .WithStreamData(stream);




                        await _minioClient.PutObjectAsync(putObjectArgs);
                    }
                    catch (Exception ex)
                    {
                        return StatusCode(500, ex.Message);
                    }
                }

                await _appDbContext.Materials.AddAsync(material);
                await _appDbContext.SaveChangesAsync();
                return Ok(material);



            }

            [HttpGet("DownloadMaterial")]
            public async Task<IActionResult> DownloadMaterial(int materialId)
            {
           
                var material = await _appDbContext.Materials.FindAsync(materialId);
 

                if(material is null)
                {
                    return NotFound();
                }

                using (MemoryStream stream = new MemoryStream())
                {
                    GetObjectArgs getObjectArgs = new GetObjectArgs()
                        .WithBucket(material.Bucket)
                        .WithObject(material.FileName)
                        .WithCallbackStream(callback => callback.CopyTo(stream));

           
                    await _minioClient.GetObjectAsync(getObjectArgs);

            
                    stream.Position = 0;

           
                    return File(stream.ToArray(), "application/pdf", material.FileName);
                }
             }

            [HttpGet("GetMaterials")]
            public async Task<IActionResult> GetMaterials(int courseId)
            {
                var materials = await _appDbContext.Materials
                                                    .Where(x => x.CourseId == courseId)
                                                    .ToListAsync();

                if (!materials.Any())
                {
                    return NotFound("No materials found for this course.");
                }

                return Ok(materials);
            }

            [HttpGet("GetCourse")]
            public async Task<IActionResult> Get()
            {
                var courses = await _appDbContext.Courses.ToListAsync();
                return Ok(courses);
            }

         [HttpGet("GetRole")]
        public IActionResult GetRole()
        {
            var role = this.User.Claims.FirstOrDefault(x => x.Type == "Role");
            var id = this.User.Claims.FirstOrDefault(x => x.Type == "UserId");
            if(role == null||id==null)
            {
                return BadRequest("Error at token: missing role or userId");
            }

            return Ok(new { Role = role.Value,UserId= id.Value });
        }

        }
    }

