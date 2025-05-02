package own.naptracker.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import own.naptracker.model.Category;
import own.naptracker.model.Log;
import own.naptracker.model.User;
import own.naptracker.repository.CategoryRepository;
import org.springframework.web.bind.annotation.*;
import own.naptracker.repository.LogRepository;

import java.util.List;

@RestController
@RequestMapping("api/categories")
@CrossOrigin(origins = "*")
public class CategoryController {

    private final LogRepository logRepository;

    private final CategoryRepository categoryRepository;

    public CategoryController(CategoryRepository categoryRepository, LogRepository logRepository) {
        this.categoryRepository = categoryRepository;
        this.logRepository = logRepository;
    }

    @GetMapping
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @GetMapping("/{id}")
    public Category getCategoryById(@PathVariable Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(("Category not found with ID: ") + id));
    }


    @PostMapping
    public ResponseEntity<String> createCategory(@RequestBody Category category, Authentication authentication) {

        Category savedCategory = categoryRepository.save(category);

        User user = (User) authentication.getPrincipal();

        Log log = new Log();
        log.setAction("create");
        log.setDescription("created category: " + savedCategory.getName());
        log.setRecordId(savedCategory.getId());
        log.setRecordType("Category");
        log.setUser(user);

        //save the log
        logRepository.save(log);

        return ResponseEntity.ok("Category created successfully");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateCategory(@PathVariable Long id, @RequestBody Category updatedCategory, Authentication authentication) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        category.setName(updatedCategory.getName());

        Category updateCategory = categoryRepository.save(category);

        User user = (User) authentication.getPrincipal();

        Log log = new Log();
        log.setAction("update");
        log.setDescription("Updated category: " + updateCategory.getName());
        log.setRecordId(updateCategory.getId());
        log.setRecordType("Category");
        log.setUser(user);

        logRepository.save(log);


        return ResponseEntity.ok("Category updated successfully");
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCategory(@PathVariable Long id, Authentication authentication) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        User user = (User) authentication.getPrincipal();

        Log log = new Log();
        log.setAction("delete");
        log.setDescription("Deleted category: " + category.getName());
        log.setRecordId(category.getId());
        log.setRecordType("Category");
        log.setUser(user);

        logRepository.save(log);
        categoryRepository.deleteById(id);

        return ResponseEntity.ok("Category deleted successfully");
    }

}
