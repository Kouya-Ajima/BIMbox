package com.rugbyaholic.communityPG.comms;

import java.io.IOException;
import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.rugbyaholic.communityPG.auth.AuthenticatedUser;
import com.rugbyaholic.communityPG.comms.forms.TopicCreationForm;

@Controller
public class MeetingRoomController {

	@Autowired 
	private MeetingRoomService service;

	@ModelAttribute
	public TopicCreationForm topicCreationForm() {
		return new TopicCreationForm();
	}
	
	@ModelAttribute("topics")
	public List<Topic> initializeTopics(TopicSearchForm form) {
		return service.loadTopics(form);
	}

	@ModelAttribute
	public Topic topic(TopicCreationForm form) {
		return service.reloadTopic(form.getTopicNo());
	}

	@ModelAttribute("user")
	public AuthenticatedUser user(@AuthenticationPrincipal AuthenticatedUser user) {
		return user;
	}

	// 初期表示
	@GetMapping("/comms/MeetingRoom.html")
	public String onMeetingRoomRequested(Model model) {
		model.addAttribute("topicSearchForm", new TopicSearchForm());
		return "comms/MeetingRoom.html";
	}

	// 検索結果を表示
	@PostMapping("/manage/users/UserSearch.do")
	public String onSerchMeetingRoomRequested(@Valid TopicSearchForm form, 
											  BindingResult bindingResult, Model model) {
		if (bindingResult.hasErrors()) {
			return "comms/MeetingRoom.html";
		} else {
			return "comms/MeetingRoom.html";
		}
	}
	
	// トピック新規作成
	@PostMapping("/comms/CreateTopic.do")
	public String onTopicRegistrationRequested(@Valid TopicCreationForm form, 
											   BindingResult bindingResult, Model model,
											   @AuthenticationPrincipal AuthenticatedUser user) 
													   throws IllegalStateException, IOException {
		if (bindingResult.hasErrors()) {
			form.setError(true);
			return "comms/MeetingRoom.html";
		} else {
			service.registerNewTopic(form, user);
			return "redirect:/comms/MeetingRoom.html";
		}
	}

	// コメントの追加
	@PostMapping("/comms/AppendPost.do")
	public String onAppendPostRequested(@Valid TopicCreationForm form, 
										BindingResult bindingResult, Model model,
										@AuthenticationPrincipal AuthenticatedUser user) {
		if (bindingResult.hasErrors()) {
			model.addAttribute("validationMessage", bindingResult.getFieldError().getDefaultMessage());
		} else {
			service.appendPost(form, user);
		}
		model.addAttribute("topic", service.reloadTopic(form.getTopicNo()));
		return "fragments/Topic :: topic";
	}

	// 投稿編集  @RequestParam("postImg") ImageFile postImg,
	@PostMapping("/comms/EditPost.do")
	public String onEditPostRequested(@RequestParam("postText") String postText,
									  @RequestParam("postImg") String postImg,
									  @RequestParam("topicNo") String topicNo,
									  @RequestParam("postNo") int postNo, Model model) {
		service.editPost(postText, postImg, topicNo, postNo);
		model.addAttribute("topic", service.reloadTopic(topicNo));
		return "fragments/Topic :: topic";
	}

	// 投稿削除
	@PostMapping("/comms/DeletePost.do")
	public String onDeletePostRequested(@RequestParam("topicNo") String topicNo,
										@RequestParam("postNo") int postNo, Model model) {
		service.deletePost(topicNo, postNo);
		model.addAttribute("topic", service.reloadTopic(topicNo));
		return "fragments/Topic :: topic";
	}
	
	// TOPIC削除
	@PostMapping("/comms/deleteTopic.do")
	public String onDeleteTopicRequested(@RequestParam("topicNo") String topicNo, 
										 TopicSearchForm form, Model model) {
		service.deleteTopic(topicNo);
		return  "redirect:/comms/MeetingRoom.html";
	}
	
	// 投稿評価
	@PostMapping("/comms/PostRating.do")
	public String onPostRatingRequested(@RequestParam("topicNo") String topicNo, 
										@RequestParam("postNo") int postNo,
										@RequestParam("rating") int rating, Model model, 
										@AuthenticationPrincipal AuthenticatedUser user) {
		service.postRating(topicNo, postNo, rating, user);
		model.addAttribute("topic", service.reloadTopic(topicNo));
		return "fragments/Topic :: topic";
	}

}